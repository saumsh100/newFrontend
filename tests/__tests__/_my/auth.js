
import request from 'supertest';
import app from '../../../server/bin/app';
import { AuthSession, PatientUser, Patient, PinCode } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../_util/seedTestUsers';
import { patientUser, patientUserId, seedTestPatients } from '../../_util/seedTestPatients';
import { omitPropertiesFromBody, omitProperties } from '../../util/selectors';

const host = 'my2.test.com';
const rootUrl = '/auth';

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
    .set('Host', host)
    .send({
      email: patientUser.email,
      password: '!@CityOfBudaTest#$',
    });

  return response.body.token;
}

async function seedTestAuthSessions() {
  await wipeModel(AuthSession);
  await AuthSession.create(authSession);
}

async function seedTestPinCodes() {
  await wipeModel(PinCode);
  await PinCode.create(pinCode);
}

describe('/auth', () => {
  beforeEach(async() =>  {
    await seedTestUsers();
    await seedTestPatients();
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
        .get(`${rootUrl}/me`)
        .set('Host', host)
        .set('Authorization', `Bearer ${token}`)
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
        .post(`${rootUrl}/signup`)
        .set('Host', host)
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
        .post(`${rootUrl}/signup/${patientUserId}/confirm`)
        .set('Host', host)
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
        .post(`${rootUrl}/signup/${patientUserId}/confirm`)
        .set('Host', host)
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
        .post(rootUrl)
        .set('Host', host)
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
        .post(rootUrl)
        .set('Host', host)
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
        .delete(`${rootUrl}/session/${authSessionId}`)
        .set('Host', host)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
