
import { Router } from 'express';
import url from 'url';
import crypto from 'crypto';
import {
  Account,
  PatientUser,
  PatientUserFamily,
  PatientUserReset,
  PinCode,
  Token,
} from 'CareCruModels';
import { PatientAuth } from '../../../lib/_auth';
import { sequelizeAuthMiddleware } from '../../../middleware/patientAuth';
import twilioClient from '../../../config/twilio';
import { sequelizeLoader } from '../../util/loaders';
import { generateAccountParams, encodeParams } from './util/params';
import StatusError from '../../../util/StatusError';
import { sendPatientSignup, sendPatientResetPassword } from '../../../lib/mail';
import { twilio, apiServerUrl, myHost } from '../../../config/globals';

const authRouter = Router();

authRouter.param(
  'patientUserId',
  sequelizeLoader('patientUser', 'PatientUser'),
);
authRouter.param('accountId', sequelizeLoader('account', 'Account'));

const signTokenAndSend = res => ({ session, model }) => {
  const tokenData = {
    patientUserId: model.id,
    sessionId: session.id,
  };

  return PatientAuth.signToken(tokenData)
    .then(token => res.json({ token }))
    .then(() => model);
};

const createConfirmationText = pinCode =>
  `${pinCode} is your CareCru verification code.`;

const generateEmailConfirmationURL = tokenId =>
  `${apiServerUrl}/my/auth/signup/${tokenId}/email`;

async function sendConfirmationMessage(patientUser) {
  // Leave console.log here, it is helpful
  console.log(
    `Sending Confirmation Message to ${patientUser.firstName} ${
      patientUser.lastName
    } at ${patientUser.phoneNumber}`,
  );
  const { pinCode } = await PinCode.create({ modelId: patientUser.id });
  return twilioClient.messages.create({
    to: patientUser.phoneNumber,
    from: twilio.phoneNumber,
    body: createConfirmationText(pinCode),
  });
}

authRouter.post('/signup/:accountId', (req, res, next) => {
  const { body: patient } = req;
  const { ignoreConfirmationText } = req.query;
  if (patient.password !== patient.confirmPassword) {
    next({
      status: 400,
      message: "Passwords doesn't match.",
    });
  }

  return PatientAuth.signup(patient)
    .then(async ({ session, model }) => {
      // For ever patientUser, create a family and make it
      const family = await PatientUserFamily.create({ headId: model.id });
      model = await model.update({ patientUserFamilyId: family.id });
      return {
        session,
        model,
      };
    })
    .then(async ({ session, model }) => {
      if (twilio.phoneNumber && ignoreConfirmationText !== 'true') {
        await sendConfirmationMessage(model);
      }

      return {
        session,
        model,
      };
    })
    .then(signTokenAndSend(res))
    .then(async (patientUser) => {
      const { email, firstName, id } = patientUser;

      const account = req.account.get({ plain: true });

      // Create token
      const tokenId = crypto.randomBytes(12).toString('hex');
      const token = await Token.create({
        id: tokenId,
        patientUserId: id,
        accountId: account.id,
      });

      // Generate the URL to confirm email
      const confirmationURL = generateEmailConfirmationURL(token.id);
      const accountLogoUrl =
        typeof account.fullLogoUrl === 'string' &&
        account.fullLogoUrl.replace('[size]', 'original');

      // Send Mandrill email async
      sendPatientSignup({
        toEmail: email,
        mergeVars: [
          {
            name: 'PRIMARY_COLOR',
            content: account.bookingWidgetPrimaryColor || '#206477',
          },
          {
            name: 'ACCOUNT_CLINICNAME',
            content: account.name,
          },
          {
            name: 'ACCOUNT_LOGO_URL',
            content: accountLogoUrl,
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: account.phoneNumber,
          },
          {
            name: 'ACCOUNT_CITY',
            content: account.address.city,
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: account.contactEmail,
          },
          {
            name: 'ACCOUNT_ADDRESS',
            content: account.address.street,
          },
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'EMAIL_CONFIRMATION_URL',
            content: confirmationURL,
          },
        ],
      });
    })
    .catch(next);
});

authRouter.post(
  '/signup/:patientUserId/confirm',
  async ({ body: { confirmCode }, patientUser }, res, next) => {
    try {
      const pc = await PinCode.findOne({
        where: {
          pinCode: confirmCode,
          modelId: patientUser.id,
        },
      });

      const p = await patientUser.update({ isPhoneNumberConfirmed: true });

      await pc.destroy();

      return res.send(p);
    } catch (e) {
      next(StatusError(400, 'Invalid confirmation code'));
    }
  },
);

authRouter.post('/:patientUserId/resend', (req, res, next) => {
  const { patientUser, params } = req;
  if (params.patientUserId !== patientUser.id) {
    return next(
      StatusError(
        403,
        'Requesting user does not have permission to resend another patients sms.',
      ),
    );
  }

  return PinCode.findAll({ where: { modelId: patientUser.id } })
    .then((pinCodes) => {
      for (const pc of pinCodes) {
        // Should we await these ?
        pc.destroy();
      }

      sendConfirmationMessage(patientUser);
      res.end();
    })
    .catch(next);
});

authRouter.get(
  '/signup/:tokenId/email',
  async ({ params: { tokenId } }, res, next) => {
    try {
      const token = await Token.findOne({
        where: { id: tokenId },
        paranoid: false,
      });

      if (!token) {
        return next(
          StatusError(StatusError.GONE, `Token with id=${tokenId} not found`),
        );
      }

      const { patientUserId, accountId } = token;
      const account = await Account.findById(accountId);

      if (!token.deletedAt) {
        const patientUser = await PatientUser.findById(patientUserId);
        await patientUser.update({ isEmailConfirmed: true });
        await token.destroy();
      }

      res.redirect(
        url.format({
          host: myHost,
          pathname: '/signup/confirmed',
          query: {
            params: encodeParams({ account: generateAccountParams(account) }),
          },
        }),
      );
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post(
  '/reset/:accountId',
  ({ body: { email }, account }, res, next) => {
    const token = crypto.randomBytes(12).toString('hex');
    const fullUrl = `${process.env.API_SERVER_URL}/my/reset/${token}`;

    PatientUser.findOne({ where: { email } })
      .then(async (patientUser) => {
        if (!patientUser) {
          return res.sendStatus(200);
        }

        await PatientUserReset.create({
          patientUserId: patientUser.id,
          accountId: account.id,
          token,
        });

        const accountJson = account.get({ plain: true });
        const accountLogoUrl =
          typeof accountJson.fullLogoUrl === 'string' &&
          accountJson.fullLogoUrl.replace('[size]', 'original');

        // TODO: use merge_var generator
        const mergeVars = [
          {
            name: 'PRIMARY_COLOR',
            content: accountJson.bookingWidgetPrimaryColor || '#206477',
          },
          {
            name: 'ACCOUNT_CLINICNAME',
            content: accountJson.name,
          },
          {
            name: 'ACCOUNT_LOGO_URL',
            content: accountLogoUrl,
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: accountJson.phoneNumber,
          },
          {
            name: 'ACCOUNT_CITY',
            content: accountJson.address.city,
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: accountJson.contactEmail,
          },
          {
            name: 'ACCOUNT_ADDRESS',
            content: accountJson.address.street,
          },
          {
            name: 'RESET_URL',
            content: fullUrl,
          },
        ];

        // Do not await...
        sendPatientResetPassword({
          toEmail: email,
          mergeVars,
        });

        return res.sendStatus(200);
      })
      .catch(next);
  },
);

authRouter.post('/', ({ body: { email, password } }, res, next) =>
  PatientAuth.login(email, password)
    .then(signTokenAndSend(res))
    .catch(next));

authRouter.delete(
  '/session/:sessionId',
  ({ params: { sessionId } }, res, next) =>
    PatientAuth.logout(sessionId)
      .then(() => res.sendStatus(200))
      .catch(next),
);

authRouter.get('/me', sequelizeAuthMiddleware, (req, res, next) => {
  const { patientUserId, sessionId } = req;
  return PatientUser.findById(patientUserId)
    .then(
      patientUser =>
        patientUser || Promise.reject(`No PatientUser with id=${patientUserId}`),
    )
    .then(patientUser =>
      res.json({
        sessionId,
        patientUser,
      }))
    .catch(next);
});

export default authRouter;
