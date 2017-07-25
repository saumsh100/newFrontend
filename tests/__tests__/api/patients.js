
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Appointment, Patient } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { serviceId, service, seedTestService } from '../../util/seedTestServices';
import { patient, patientId } from '../../util/seedTestPatients';
import { seedTestAppointments } from '../../util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const batchPatientId = '8ec1c573-a092-4649-a219-81be86cd1552';
const batchPatientId2 = '7a1146f9-1d48-4a5f-8479-f6172d5a83b5';
const batchPatientId3 = '8405acdd-4559-4396-beb8-2e8ce79307c3';
const batchPatientId4 = '68238eca-3e5c-4fbd-a641-f68ded47510d';
const batchInvalidPatientId = 'eb6be674-1861-4432-8a2e-48c402ba2aaa';

const batchPatient = {
  id: batchPatientId,
  accountId,
  avatarUrl: '',
  email: 'batchpatient@test.com',
  pmsId: 0,
  firstName: 'Bonald',
  lastName: 'Mcdonald',
  pmsId: null,
  mobilePhoneNumber: '7789999998',
};

const batchPatient2 = {
  id: batchPatientId2,
  accountId,
  avatarUrl: '',
  email: 'batchpatient2@test.com',
  pmsId: 0,
  firstName: 'Conald',
  lastName: 'Mcdonald',
  pmsId: null,
  mobilePhoneNumber: '7789999988',
};

const batchPatient3 = {
  id: batchPatientId3,
  accountId,
  avatarUrl: '',
  email: 'batchpatient3@test.com',
  pmsId: 0,
  firstName: 'Donald',
  lastName: 'Mcdonald',
  pmsId: null,
  mobilePhoneNumber: '7789999888',
};

const batchPatient4 = {
  id: batchPatientId4,
  accountId,
  avatarUrl: '',
  email: 'batchpatient4@test.com',
  pmsId: 0,
  firstName: 'Fonald',
  lastName: 'Mcdonald',
  pmsId: null,
  mobilePhoneNumber: '7789998888',
};

const batchInvalidPatient = {
  id: batchInvalidPatientId,
  accountId,
  avatarUrl: '',
  email: 'batchpatient@test.com',
  pmsId: 0,
  lastName: 'McInvalid',
  pmsId: null,
  mobilePhoneNumber: '7784444444',
};

describe('/api/patients', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
   await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/ - get all patients under a clinic', () => {
      return request(app)
        .get('/api/patients/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:patientId - retrieve a patient', () => {
      return request(app)
        .get(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:patientId/stats - retrieve patient appointments', () => {
      return request(app)
        .get(`/api/patients/${patientId}/stats`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });


    // TODO: Don't quite understand the response from this
    test('/stats - retrieve patients appointments', () => {
      return request(app)
        .get('/api/patients/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - no results', () => {
      return request(app)
        .get('/api/patients/search?patients=Dylan')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - result found', () => {
      return request(app)
        .get('/api/patients/search?patients=Ronald')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - no result found', () => {
      return request(app)
        .get('/api/patients/suggestions?firstName=Mr&lastName=Nothing&email=lala&phoneNumber=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - result found', () => {
      return request(app)
        .get('/api/patients/suggestions?firstName=Ronald')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(Appointment);
      await wipeModel(Patient);
    });

    test('/emailCheck - result not found', async () => {
      await seedTestAppointments();
      return request(app)
        .post('/api/patients/emailCheck')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'mrnotfound@test.com',
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/emailCheck - result found', async () => {
      await seedTestAppointments();
      return request(app)
        .post('/api/patients/emailCheck')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'testpatient@test.com',
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/phoneNumberCheck - result not found', async () => {
      await seedTestAppointments();
      return request(app)
        .post('/api/patients/phoneNumberCheck')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phoneNumber: '7788888888',
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/phoneNumberCheck - result found', async () => {
      await seedTestAppointments();
      return request(app)
        .post('/api/patients/phoneNumberCheck')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phoneNumber: '+17789999999',
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - create a patient', () => {
      return request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patient)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/batch - 4 patients created successfully', () => {
      return request(app)
        .post('/api/patients/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchPatient, batchPatient2, batchPatient3, batchPatient4],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.patients).length).toBe(4);
        });
    });

    test('/batch - 1 invalid patient, 3 valid patients', () => {
      return request(app)
        .post('/api/patients/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchInvalidPatient, batchPatient2, batchPatient3, batchPatient4],
        })
        .expect(400)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.patients).length).toBe(3);
        });
    });

  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/:patientId - update patient', () => {
      return request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Wendy',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/:patientId - delete patient', () => {
      return request(app)
        .delete(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
