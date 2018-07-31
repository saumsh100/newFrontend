import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { WaitSpot, Patient, PatientUser } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { serviceId, seedTestService, wipeTestService } from '../../util/seedTestServices';
import {
  practitionerId,
  seedTestPractitioners,
  wipeTestPractitioners,
} from '../../util/seedTestPractitioners';
import { patientId, patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/waitSpots';

const waitSpotId = 'cc43f0d7-9fb0-4946-b889-f284ea48e4d0';
const waitSpot = {
  id: waitSpotId,
  patientId,
  patientUserId,
  accountId,
  endDate: '2017-09-27T00:14:30.932Z',
  createdAt: '2017-09-27T00:14:30.932Z',
};

async function seedTestWaitSpot() {
  await seedTestPatients();
  await wipeModel(WaitSpot);
  await WaitSpot.create(waitSpot);
}

// Mocking the socketio server
app.set('socketio', {
  of: () => ({
    in: () => ({
      emit: () => jest.fn(),
    }),
  }),
});

describe('/api/waitSpots', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(WaitSpot);
    await seedTestUsers();
    await seedTestWaitSpot();
    await seedTestPractitioners();
    await seedTestService();

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(WaitSpot);
    await wipeModel(Patient);
    await wipeModel(PatientUser);
    await wipeTestUsers();
    await wipeTestPractitioners();
    await wipeTestService();
  });

  describe('GET /', () => {
    test('retrieve a waitSpot', () =>
      request(app)
        .get(`${rootUrl}?startTime=2017-09-25T00:14:30.932Z&endTime=2017-09-29T00:14:30.932Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['unavailableDays']);
          expect(body).toMatchSnapshot();
        }));
  });

  describe('POST /', () => {
    test('create a waitSpot', () => {
      const id = '6303daf4-377e-4b70-843b-08671e6183d7';
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id,
          accountId,
          patientId,
          patientUserId,
          createdAt: '2017-07-29T00:14:30.932Z',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['endDate', 'unavailableDays']);
          expect(body).toMatchSnapshot();
        });
    });

    test('create a waitSpot with reason and practitioner', async () => {
      const id = '6303daf4-377e-4b70-843b-08671e6183d7';
      const result = await request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id,
          accountId,
          patientId,
          patientUserId,
          createdAt: '2017-07-29T00:14:30.932Z',
          reasonId: serviceId,
          practitionerId,
        })
        .expect(201);

      const body = omitPropertiesFromBody(result.body, ['endDate', 'unavailableDays']);
      expect(body).toMatchSnapshot();
    });
  });

  describe('PUT /:waitSpotId', () => {
    test('update a waitSpot', () =>
      request(app)
        .put(`${rootUrl}/${waitSpotId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
          patientId,
          patientUserId,
          createdAt: '2017-07-29T00:15:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['unavailableDays']);
          expect(body).toMatchSnapshot();
        }));
  });

  describe('DELETE /:waitSpotId', () => {
    test('delete a waitSpot', () =>
      request(app)
        .delete(`${rootUrl}/${waitSpotId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        }));
  });
});
