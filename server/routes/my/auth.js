
import { Router } from 'express';
import crypto from 'crypto';
import { PatientAuth } from '../../lib/auth';
import authMiddleware from '../../middleware/patientAuth';
import twilio, { phoneNumber } from '../../config/twilio';
import loaders from '../util/loaders';
import StatusError from '../../util/StatusError';
import { PatientUser, PinCode, Token } from '../../models';
import { sendPatientSignup } from '../../lib/mail';

const authRouter = Router();

authRouter.param('patientUserId', loaders('patientUser', 'PatientUser'));
authRouter.param('tokenId', loaders('token', 'Token'));

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
  const { pinCode } = await PinCode.generateConfirmation(patientUser.id);
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
      await sendConfirmationMessage(model);
      return { session, model };
    })
    .then(signTokenAndSend(res))
    .then(async (patientUser) => {
      const { email, firstName, id } = patientUser;

      // Create token
      const tokenId = crypto.randomBytes(12).toString('hex');
      const token = await Token.save({ id: tokenId, patientUserId: id });

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
  return PinCode.get(confirmCode)
    .then((pc) => {
      const { pinCode, modelId } = pc;
      if (patientUser.id === modelId && pinCode === confirmCode) {
        patientUser.merge({ isPhoneNumberConfirmed: true }).save()
          .then(p => res.send(p))
          .then(() => pc.delete());
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
  console.log(patientUser);
  console.log(params);
  return PinCode.filter({ modelId: patientUser.id })
    .then((pinCodes) => {
      for (const pc of pinCodes) {
        // Should we await these ?
        pc.delete();
      }

      sendConfirmationMessage(patientUser);
    })
    .catch(next);
});

authRouter.get('/signup/:tokenId/email', async (req, res, next) => {
  try {
    const { token } = req;
    const { patientUserId } = token;
    const patientUser = await PatientUser.get(patientUserId);
    await patientUser.merge({ isEmailConfirmed: true }).save();
    await token.delete();
    return res.render('patient-email-confirmed');
  } catch (err) {
    next(err);
  }
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

authRouter.get('/me', authMiddleware, (req, res, next) => {
  const { patientUserId, sessionId } = req;
  return PatientUser.get(patientUserId)
    .then(patientUser =>
      res.json({
        sessionId,
        patientUser,
      })
    )
    .catch(next);
});

export default authRouter;
