
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { PatientAuth } from '../../lib/_auth';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import twilio, { phoneNumber } from '../../config/twilio';
import { sequelizeLoader } from '../util/loaders';
import StatusError from '../../util/StatusError';
import { PatientUser, PinCode, Token } from '../../_models';
import { sendPatientSignup, sendPatientResetPassword } from '../../lib/mail';

const authRouter = Router();

authRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
authRouter.param('tokenId', sequelizeLoader('token', 'Token'));

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
  const { pinCode } = await PinCode.create({ modelId: patientUser.id });
  return twilio.sendMessage({
    to: patientUser.phoneNumber,
    from: phoneNumber,
    body: createConfirmationText(pinCode),
  });
}

authRouter.post('/signup', (req, res, next) => {
  const { body: patient } = req;
  if (patient.password !== patient.confirmPassword) {
    next({ status: 400, message: 'Passwords doesn\'t match.' });
  }

  // TODO: additional validation required
  // TODO: we have to use some form library for validations.
  return PatientAuth.signup(patient)
    .then(async ({ session, model }) => {
      if (phoneNumber) {
        await sendConfirmationMessage(model);
      }

      return { session, model };
    })
    .then(signTokenAndSend(res))
    .then(async (patientUser) => {
      const { email, firstName, id } = patientUser;

      // Create token
      const tokenId = crypto.randomBytes(12).toString('hex');
      const token = await Token.create({ id: tokenId, patientUserId: id });

      // Generate the URL to confirm email
      const confirmationURL = generateEmailConfirmationURL(token.id, req.protocol, req.get('host'));

      // Send Mandrill email async
      sendPatientSignup({
        toEmail: email,
        mergeVars: [
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
    const { patientUserId } = token;
    const patientUser = await PatientUser.findById(patientUserId);
    await patientUser.update({ isEmailConfirmed: true });
    await token.destroy();
    return res.render('patient-email-confirmed');
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset', (req, res, next) => {
  const {
    body,
  } = req;

  const email = body.email;
  const token = uuid();

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

      await PasswordReset.create({
        email,
        token,
      });

      const mergeVars = [
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
