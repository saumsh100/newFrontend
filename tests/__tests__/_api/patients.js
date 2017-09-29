import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { Appointment, Patient } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { serviceId, service, seedTestService } from '../../_util/seedTestServices';
import { patient, patientId } from '../../_util/seedTestPatients';
import { seedTestAppointments, wipeTestAppointments } from '../../_util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/patients';
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
  lastName: 'McInvalid',
  pmsId: null,
  mobilePhoneNumber: '7784444444',
};

describe('/api/patients', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeTestAppointments();
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeTestAppointments();
    await wipeTestUsers();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/ - get all patients under a clinic', () => {
      return request(app)
        .get(`${rootUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:patientId - retrieve a patient', () => {
      return request(app)
        .get(`${rootUrl}/${patientId}`)
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
        .get(`${rootUrl}/${patientId}/stats`)
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
        .get(`${rootUrl}/stats`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - no results', () => {
      return request(app)
        .get(`${rootUrl}/search?patients=Dylan`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - result found', () => {
      return request(app)
        .get(`${rootUrl}/search?patients=Ronald`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - phone number not found', () => {
      return request(app)
        .get(`${rootUrl}/search?patients=604-111-1111`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/search - search patients - phone number found', () => {
      return request(app)
        .get(`${rootUrl}/search?patients=778-999-9999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - no result found', () => {
      return request(app)
        .get(`${rootUrl}/suggestions?firstName=Mr&lastName=Nothing&email=lala&phoneNumber=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - result found', () => {
      return request(app)
        .get(`${rootUrl}/suggestions?firstName=Ronald&lastName=Mcdonald`)
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
      await wipeTestAppointments();
    });

    test('/emailCheck - result not found', async () => {
      await seedTestAppointments();
      return request(app)
        .post(`${rootUrl}/emailCheck`)
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
        .post(`${rootUrl}/emailCheck`)
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
        .post(`${rootUrl}/phoneNumberCheck`)
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
        .post(`${rootUrl}/phoneNumberCheck`)
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
        .post(`${rootUrl}`)
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
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchPatient, batchPatient2, batchPatient3, batchPatient4],
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.patients).length).toBe(4);
        });
    });

    test('/batch - 1 invalid patient, 3 valid patients', () => {
      return request(app)
        .post(`${rootUrl}/batch`)
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
        .put(`${rootUrl}/${patientId}`)
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
        .delete(`${rootUrl}/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:patientId - delete patient then undelete it', () => {
      return request(app)
        .delete(`${rootUrl}/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          const patientCreate = {
            accountId,
            email: 'testpatient@test.com',
            firstName: 'Ronald',
            lastName: 'Mcdonald',
            mobilePhoneNumber: '7789999999',
            createdAt: '2017-07-19T00:14:30.932Z',
            address: null,
            birthDate: null,
            familyId: null,
            gender: null,
            homePhoneNumber: null,
            pmsId: '12',
            language: null,
            middleName: null,
            otherPhoneNumber: null,
            patientUserId: null,
            phoneNumber: null,
            prefName: null,
            prefPhoneNumber: null,
            type: null,
            workPhoneNumber: null,
          };
          return request(app)
            .post(`${rootUrl}`)
            .set('Authorization', `Bearer ${token}`)
            .send(patientCreate)
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(body).toMatchSnapshot();
            });
        });
    });
  });
});
