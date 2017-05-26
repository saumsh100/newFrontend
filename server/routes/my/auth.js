import { Router } from 'express';
import { omit } from 'lodash';
import { PatientAuth } from '../../lib/auth';

const authRouter = Router();

const signTokenAndSend = res => ({ id }) =>
  PatientAuth.signToken({ id })
    .then(token => res.json({ token }));

authRouter.post('/signup', ({ body: patient }, res, next) => {
  if (patient.password !== patient.confirmPassword) {
    next({ status: 400, message: 'Passwords doesn\'t match.' });
  }

  // TODO: additional validation required
  // TODO: we have to use some form library for validations.
  return PatientAuth.signup(patient)
    .then(signTokenAndSend(res))
    .catch(next);
});

authRouter.post('/signup/:patientId/confirm', ({ body: { confirmCode }, patient }, res, next) => (
    (confirmCode === '8888') ?
      res.send(patient) :
      next({ status: 400, message: 'Invalid confirmation code' })
));

authRouter.post('/login', ({ body: { email, password } }, res, next) =>
  PatientAuth.login(email, password)
    .then(signTokenAndSend(res))
    .catch(next)
);

export default authRouter;
