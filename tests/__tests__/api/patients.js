import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Appointment, Patient, Chat } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { serviceId, service, seedTestService } from '../../util/seedTestServices';
import { patient, patientId } from '../../util/seedTestPatients';
import { seedTestAppointments, wipeTestAppointments } from '../../util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/patients';
const batchPatientId = '8ec1c573-a092-4649-a219-81be86cd1552';
const batchPatientId2 = '7a1146f9-1d48-4a5f-8479-f6172d5a83b5';
const batchPatientId3 = '8405acdd-4559-4396-beb8-2e8ce79307c3';
const batchPatientId4 = '68238eca-3e5c-4fbd-a641-f68ded47510d';
const batchInvalidPatientId = 'eb6be674-1861-4432-8a2e-48c402ba2aaa';
const pmsCreatePatientId = 'eb6be674-1861-4432-8a2e-48c402ba2aba';
const requestCreatedAt = new Date();

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

const pmsCreatePatient = {
  id: pmsCreatePatientId,
  accountId,
  avatarUrl: '',
  email: 'batchpatient2@test.com',
  firstName: 'McInvalid2',
  lastName: 'McInvalid2',
  isSyncedWithPms: false,
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
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1543651200000);
      await seedTestAppointments();
      await Patient.create(pmsCreatePatient);
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

    test('/ - get all patients under a clinic - connector not notSynced', () => {
      return request(app)
        .get(`${rootUrl}/connector/notSynced`)
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
        .send({ accountId })
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

    test('/:patientId/nextAppointment - retrieve patients next appointments', () => {
      return request(app)
        .get(`${rootUrl}/${patientId}/nextAppointment?requestCreatedAt=${requestCreatedAt}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - no result found', () => {
      return request(app)
        .get(`${rootUrl}/suggestions?firstName=Mr&lastName=Nothing&email=lala&phoneNumber=1&requestCreatedAt=${requestCreatedAt}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/suggestions - result found', () => {
      return request(app)
        .get(`${rootUrl}/suggestions?firstName=Ronald&lastName=Mcdonald&requestCreatedAt=${requestCreatedAt}`)
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
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - create a patient', () => {
      const createPatient = Object.assign({}, patient);
      delete createPatient.accountId;
      delete createPatient.familyId;
      return request(app)
        .post(`${rootUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .send(createPatient)
        .expect(201)
        .then(({ body }) => {
          console.log(body)
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
      return await seedTestAppointments();
    });

    afterEach(async () => {
      await wipeModel(Chat);
      return await wipeTestAppointments();
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
          console.log('body--->', body);
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/connector/:patientId - update patient (connector)', () => {
      return request(app)
        .put(`${rootUrl}/connector/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Testing',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestAppointments();
    });

    afterEach(async () => {
      await wipeModel(Chat);
      await wipeTestAppointments();
    });

    test('/:patientId - batch update patients', () => {
      return request(app)
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchPatient, batchPatient2, batchPatient3, batchPatient4],
        })
        .expect(201)
        .then(({}) => {
          const patient1 = Object.assign({}, batchPatient, { lastName: 'HELLO' });
          const patient2 = Object.assign({}, batchPatient2, { lastName: 'HELLO2' });
          const patient3 = Object.assign({}, batchPatient3, { lastName: 'HELLO3' });
          const patient4 = Object.assign({}, batchPatient4, { lastName: 'HELLO4' });
          return request(app)
            .put(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([patient1, patient2, patient3, patient4])
            .expect(201)
            .then(({ body }) => {
              expect(Object.keys(body.entities.patients).length).toBe(4);

              expect(body.entities.patients[batchPatientId].lastName).toBe('HELLO');
              expect(body.entities.patients[batchPatientId2].lastName).toBe('HELLO2');
              expect(body.entities.patients[batchPatientId3].lastName).toBe('HELLO3');
              expect(body.entities.patients[batchPatientId4].lastName).toBe('HELLO4');
            });
        });
    });

    test('/:patientId - batch update patients', () => {
      const batchPatient1New = Object.assign({}, batchPatient, { pmsId: '112' });
      const batchPatient2New = Object.assign({}, batchPatient2, { pmsId: '113' });
      const batchPatient3New = Object.assign({}, batchPatient3, { pmsId: '114' });
      const batchPatient4New = Object.assign({}, batchPatient4, { pmsId: '115' });
      return request(app)
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchPatient1New, batchPatient2New, batchPatient3New, batchPatient4New],
        })
        .expect(201)
        .then(({}) => {
          const patient1 = Object.assign({}, batchPatient, { pmsId: '112', lastName: 'HELLO' });
          const patient2 = Object.assign({}, batchPatient2, { pmsId: '113', lastName: 'HELLO2' });
          const patient3 = Object.assign({}, batchPatient3, { pmsId: '115', lastName: 'HELLO3' });
          const patient4 = Object.assign({}, batchPatient4, { pmsId: '115', lastName: 'HELLO4' });
          return request(app)
            .put(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([patient1, patient2, patient3, patient4])
            .expect(201)
            .then(({ body }) => {
              expect(Object.keys(body.entities.patients).length).toBe(3);

              expect(body.entities.patients[batchPatientId].lastName).toBe('HELLO');
              expect(body.entities.patients[batchPatientId2].lastName).toBe('HELLO2');
              expect(body.entities.patients[batchPatientId4].lastName).toBe('HELLO4');
            });
        });
    });

    test('/:patientId - batch update patients with chat', () => {
      return request(app)
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          patients: [batchPatient, batchPatient2, batchPatient3, batchPatient4],
        })
        .expect(201)
        .then(async () => {
          await Chat.create({
            accountId,
            patientId: batchPatientId,
            patientPhoneNumber: '+17789999991',
          });
          const patient1 = Object.assign({}, batchPatient, { lastName: 'HELLO' });
          const patient2 = Object.assign({}, batchPatient2, { lastName: 'HELLO2' });
          const patient3 = Object.assign({}, batchPatient3, { lastName: 'HELLO3' });
          const patient4 = Object.assign({}, batchPatient4, { lastName: 'HELLO4' });
          return request(app)
            .put(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([patient1, patient2, patient3, patient4])
            .expect(201)
            .then(({ body }) => {
              expect(Object.keys(body.entities.patients).length).toBe(4);

              expect(body.entities.patients[batchPatientId].lastName).toBe('HELLO');
              expect(body.entities.patients[batchPatientId2].lastName).toBe('HELLO2');
              expect(body.entities.patients[batchPatientId3].lastName).toBe('HELLO3');
              expect(body.entities.patients[batchPatientId4].lastName).toBe('HELLO4');
            });
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
