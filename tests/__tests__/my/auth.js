
import request from 'supertest';
import app from '../../../server/bin/app';
import { AuthSession, PatientUser, Patient, PinCode } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { patientUser, patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody, omitProperties } from '../../util/selectors';


const pinCodeId = '76d50acd-44f1-414e-bc9b-c0d197ce7149';
const authSessionId = 'c5574713-835d-4371-8cfe-8ad242a33499';

const pinCode = {
  id: pinCodeId,
  pinCode: '1234',
  modelId: patientUserId,
};

const authSession = {
  modelId: patientUserId,
  accountId,
  enterpriseId,
};

async function generatePatientUserToken() {
  const response = await request(app)
    .post('/auth')
    .set('Host', 'my.test.com')
    .send({
      email: patientUser.email,
      password: '!@CityOfBudaTest#$',
    });

  return response.body.token;
}

async function seedTestAuthSessions() {
  await wipeModel(AuthSession);
  await AuthSession.save(authSession);
}

async function seedTestPinCodes() {
  await wipeModel(PinCode);
  await PinCode.save(pinCode);
}

describe('/auth', () => {
  beforeAll(async() => {
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestPatients();
      await seedTestAuthSessions();
    });

    test('/me - get current patientUser', async () => {
      const token = await generatePatientUserToken();
      return request(app)
        .get(`/auth/me?patientUserId=${patientUserId}&sessionId=${authSessionId}`)
        .set('Host', 'my.test.com')
        .set('Authorization', `Bearer ${token}`)
        .send(Object.assign(patientUser, { confirmPassword: patientUser.password }))
        .expect(200)
        .then(({ body }) => {
          body.patientUser = omitProperties(body.patientUser, ['password']);
          body = omitProperties(body, ['sessionId']);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(PatientUser);
      await wipeModel(Patient);
      await wipeModel(PinCode);
    });

    test('/signup - sign up a patientUser', () => {
      return request(app)
        .post('/auth/signup')
        .set('Host', 'my.test.com')
        .send(Object.assign(patientUser, { confirmPassword: patientUser.password }))
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toHaveProperty('token');
        });
    });

    test('/signup/:patientUserId/confirm - confirm patientUser phoneNumber - successful', async () => {
      await seedTestPatients();
      await seedTestPinCodes();
      return request(app)
        .post(`/auth/signup/${patientUserId}/confirm`)
        .set('Host', 'my.test.com')
        .send({ confirmCode: pinCode.pinCode })
        .expect(200)
        .then(({ body }) => {
          body = omitProperties(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/signup/:patientUserId/confirm - confirm patientUser phoneNumber - unsuccessful', async () => {
      await seedTestPatients();
      await seedTestPinCodes();
      return request(app)
        .post(`/auth/signup/${patientUserId}/confirm`)
        .set('Host', 'my.test.com')
        .send({ confirmCode: '4321' })
        .expect(400)
        .then(({ body }) => {
          body = omitProperties(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Figure out why async jasmine error occurs
    /*
    test.only('/:patientUserId/resend - resend sms to patient', async () => {
      await seedTestPatients();
      return request(app)
        .post(`/auth/${patientUserId}/resend`)
        .set('Host', 'my.test.com')
        .send(Object.assign(patientUser, { patientUserId }))
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
    */

    test('/ - login - successful', async () => {
      await seedTestPatients();
      return request(app)
        .post('/auth')
        .set('Host', 'my.test.com')
        .send({
          email: patientUser.email,
          password: '!@CityOfBudaTest#$',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toHaveProperty('token');
        });
    });

    test('/ - login - unsuccessful', async () => {
      await seedTestPatients();
      return request(app)
        .post('/auth')
        .set('Host', 'my.test.com')
        .send({
          email: patientUser.email,
          password: 'wrongpassword',
        })
        .expect(401)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestPatients();
      await seedTestAuthSessions();
    });

    test('/session/:sessionId - log out patientUser', async () => {
      return request(app)
        .delete(`/auth/session/${authSessionId}`)
        .set('Host', 'my.test.com')
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
