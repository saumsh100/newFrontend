import request from 'supertest';
import app from '../../../server/bin/app';
import { Account, Recall, Address, Patient, Appointment } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { recallId1, seedTestRecalls } from '../../_util/seedTestRecalls';
import generateToken from '../../_util/generateToken';
import { getModelsArray, omitPropertiesFromBody, omitProperties } from '../../util/selectors';
import { seedTestPatients, patientId } from '../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../_util/seedTestPractitioners';

// TODO: make seeds more modular so we can see here
// const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
// const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';

const newRecallId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/accounts/:account/recalls', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();

    // Seed an extra account for fetching multiple and testing switching
    await Address.create(address);

    await Account.create({
      id: accountId2,
      addressId,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    await wipeModel(Recall);
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Recall);
    await wipeTestUsers();
  });

  describe('Recalls', () => {
    beforeEach(async () => {
      await seedTestRecalls();
    });

    describe('GET /:accountId/recalls', () => {
      test('should fetch all recalls for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const recalls = getModelsArray('recalls', body);
            expect(recalls.length).toBe(2);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .get(`${rootUrl}/${accountId2}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('POST /:accountId/recalls', () => {
      test('should create a recall for the account', () => {
        return request(app)
          .post(`${rootUrl}/${accountId}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: newRecallId,
            primaryTypes: ['sms'],
            interval: '-2 months',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(201)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const recalls = getModelsArray('recalls', body);
            expect(recalls.length).toBe(1);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .post(`${rootUrl}/${accountId2}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('PUT /:accountId/recalls/:recallId', () => {
      test('should update a recall for the account', () => {
        return request(app)
          .put(`${rootUrl}/${accountId}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            primaryTypes: ['phone'],
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const recalls = getModelsArray('recalls', body);
            const [recall] = recalls;
            expect(recalls.length).toBe(1);
            expect(recall.primaryTypes).toEqual(['phone']);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .put(`${rootUrl}/${accountId2}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('DELETE /:accountId/recalls/:recallId', () => {
      afterEach(async () => {
        // have to restore recalls cause these routes could delete
        await seedTestRecalls();
      });

      test('should delete a recall for the account', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId2}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('GET /:accountId/recalls/outbox', () => {
      beforeEach(async () => {
        await wipeAllModels();
        await seedTestUsers();
        await seedTestPatients();
        await seedTestPractitioners();
        token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });

        await Recall.bulkCreate([
          {
            accountId,
            primaryTypes: ['email'],
            interval: '1 months',
          },
        ]);

        const patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', email: 'hello@hello.com', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9), contCareInterval: '6 months' }),
        ]);

        await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeModel(Recall);
        await wipeAllModels();

        await seedTestUsers();
        token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
      });

      test('Outbox for Recalls - Should return Patient Old', () => {
        const startDate = date(2016, 0, 1, 9);
        const endDate = date(2017, 8, 8, 9);
        return request(app)
          .get(`${rootUrl}/${accountId}/recalls/outbox?startDate=${startDate}&endDate=${endDate}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(async ({ body }) => {
            expect(body[0].patient.lastHygieneDate).toBe(date(2016, 7, 5, 9));

            body[0].patient = omitProperties(body[0].patient, ['id', 'lastHygieneDate']);
            body[0].recall = omitProperties(body[0].recall, ['id']);

            expect(body).toMatchSnapshot();
          });
      });

      test('Outbox for Recalls - Should not return Patient Old as their recall not in range', () => {
        const startDate = date(2016, 0, 1, 9);
        const endDate = date(2016, 8, 8, 9);
        return request(app)
          .get(`${rootUrl}/${accountId}/recalls/outbox?startDate=${startDate}&endDate=${endDate}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(async ({ body }) => {
            expect(body.length).toBe(0);
          });
      });
    });
  });
});
