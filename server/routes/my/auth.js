
import { Router } from 'express';
import { PatientAuth } from '../../lib/auth';
import twilio, { phoneNumber } from '../../config/twilio';
import loaders from '../util/loaders';
import StatusError from '../../util/StatusError';
import { PinCode } from '../../models';

const authRouter = Router();

authRouter.param('patientUserId', loaders('patientUser', 'PatientUser'));

const signTokenAndSend = res => ({ session, model }) => {
  const tokenData = {
    patientUserId: model.id,
    sessionId: session.id,
  };

  return PatientAuth.signToken(tokenData)
    .then(token => res.json({ token }));
};

const createConfirmationText = (pinCode) => {
  return `${pinCode} is your CareCru verification code.`;
};

async function sendConfirmationMessage(patientUser) {
  const { pinCode } = await PinCode.generateConfirmation(patientUser.id);
  return twilio.sendMessage({
    to: patientUser.phoneNumber,
    from: phoneNumber,
    body: createConfirmationText(pinCode),
  });
}

authRouter.post('/signup', ({ body: patient }, res, next) => {
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

authRouter.post('/login', ({ body: { email, password } }, res, next) =>
  PatientAuth.login(email, password)
    .then(signTokenAndSend(res))
    .catch(next)
);

export default authRouter;
