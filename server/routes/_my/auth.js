
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import url from 'url';
import crypto from 'crypto';
import { PatientAuth } from '../../lib/_auth';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import twilio, { phoneNumber } from '../../config/twilio';
import { sequelizeLoader } from '../util/loaders';
import { generateAccountParams, encodeParams } from './util/params';
import StatusError from '../../util/StatusError';
import { Account, PatientUser, PatientUserReset, PinCode, Token } from '../../_models';
import { sendPatientSignup, sendPatientResetPassword } from '../../lib/mail';

const authRouter = Router();

authRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
authRouter.param('tokenId', sequelizeLoader('token', 'Token'));
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

const createConfirmationText = (pinCode) => {
  return `${pinCode} is your CareCru verification code.`;
};

const generateEmailConfirmationURL = (tokenId, protocol, host) => {
  return `${protocol}://${host}/auth/signup/${tokenId}/email`;
};

async function sendConfirmationMessage(patientUser) {
  // Leave console.log here, it is helpful
  console.log(`Sending Confirmation Message to ${patientUser.firstName} ${patientUser.lastName} at ${patientUser.phoneNumber}`);
  const { pinCode } = await PinCode.create({ modelId: patientUser.id });
  return twilio.sendMessage({
    to: patientUser.phoneNumber,
    from: phoneNumber,
    body: createConfirmationText(pinCode),
  });
}

authRouter.post('/signup/:accountId', (req, res, next) => {
  const { body: patient } = req;


  const { ignoreConfirmationText } = req.query;
  if (patient.password !== patient.confirmPassword) {
    next({ status: 400, message: 'Passwords doesn\'t match.' });
  }

  // TODO: additional validation required
  // TODO: we have to use some form library for validations.
  return PatientAuth.signup(patient)
    .then(async ({ session, model }) => {
      if (phoneNumber && ignoreConfirmationText !== 'true') {
        await sendConfirmationMessage(model);
      }

      return { session, model };
    })
    .then(signTokenAndSend(res))
    .then(async (patientUser) => {
      const { email, firstName, id } = patientUser;

      const account = req.account.get({ plain: true });

      // Create token
      const tokenId = crypto.randomBytes(12).toString('hex');
      const token = await Token.create({ id: tokenId, patientUserId: id, accountId: account.id });

      // Generate the URL to confirm email
      const confirmationURL = generateEmailConfirmationURL(token.id, req.protocol, req.get('host'));

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
            content: account.logo,
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

authRouter.post('/signup/:patientUserId/confirm', (req, res, next) => {
  const { body: { confirmCode }, patientUser } = req;
  return PinCode.findById(confirmCode)
    .then((pc) => {
      const { pinCode, modelId } = pc;
      if (patientUser.id === modelId && pinCode === confirmCode) {
        patientUser.update({ isPhoneNumberConfirmed: true })
          .then(p => res.send(p))
          .then(() => pc.destroy());
      }
    })
    .catch(() => {
      next(StatusError(400, 'Invalid confirmation code'));
    });
});

authRouter.post('/:patientUserId/resend', (req, res, next) => {
  const { patientUser, params } = req;
  if (params.patientUserId !== patientUser.id) {
    return next(StatusError(403, 'Requesting user does not have permission to resend another patients sms.'));
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

authRouter.get('/signup/:tokenId/email', async (req, res, next) => {
  try {
    const { token } = req;
    const { patientUserId, accountId } = token;
    const patientUser = await PatientUser.findById(patientUserId);
    await patientUser.update({ isEmailConfirmed: true });
    await token.destroy();

    // This will be replaced with proper URL mounting for clinics
    const account = await Account.findById(accountId);
    const params = {
      account: generateAccountParams(account),
    };

    return res.redirect(url.format({
      pathname: '/signup/confirmed',
      query: { params: encodeParams(params) },
    }));
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset/:accountId', (req, res, next) => {
  const {
    body,
    account,
  } = req;

  const email = body.email;
  const token = crypto.randomBytes(12).toString('hex');

  let protocol = req.protocol;

  // this is for heroku to create the right http link it uses
  // x-forward-proto for https but shows http in req.protocol
  if (req.headers['x-forwarded-proto'] === 'https') {
    protocol = 'https';
  }

  const fullUrl = `${protocol}://${req.get('host')}/reset/${token}`;

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
          content: accountJson.logo,
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
});

authRouter.post('/', ({ body: { email, password } }, res, next) =>
  PatientAuth.login(email, password)
    .then(signTokenAndSend(res))
    .catch(next)
);

authRouter.delete('/session/:sessionId', ({ params: { sessionId } }, res, next) =>
  PatientAuth.logout(sessionId)
    .then(() => res.send(200))
    .catch(next)
);

authRouter.get('/me', sequelizeAuthMiddleware, (req, res, next) => {
  const { patientUserId, sessionId } = req;
  return PatientUser.findById(patientUserId)
    .then(patientUser => patientUser || Promise.reject(`No PatientUser with id=${patientUserId}`))
    .then(patientUser =>
      res.json({
        sessionId,
        patientUser,
      })
    )
    .catch(next);
});

export default authRouter;
