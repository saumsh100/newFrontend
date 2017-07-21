
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { WaitSpot } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId, patientUserId, seedTestPatients } from '../../util/seedTestPatients';

const waitSpotId = 'cc43f0d7-9fb0-4946-b889-f284ea48e4d0';
const waitSpot = {
  id: waitSpotId,
  patientId,
  patientUserId,
  accountId,
  endDate: '2017-07-23T00:14:30.932Z',
  createdAt: '2017-07-23T00:14:30.932Z',
};

async function seedTestWaitSpot() {
  await seedTestPatients();
  await wipeModel(WaitSpot);
  await WaitSpot.save(waitSpot);
};

describe('/api/waitSpots', () => {
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
      await seedTestWaitSpot();
    });

    test('retrieve a waitSpot', () => {
      return request(app)
        .get('/api/waitSpots')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    test('create a waitSpot', () => {
      const id = '6303daf4-377e-4b70-843b-08671e6183d7';
      return request(app)
        .post('/api/waitSpots')
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
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /:waitSpotId', () => {
    beforeEach(async () => {
      await seedTestWaitSpot();
    });

    test('update a waitSpot', () => {
      return request(app)
        .put(`/api/waitSpots/${waitSpotId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
          patientId,
          patientUserId,
          createdAt: '2017-07-29T00:15:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    test('retrieve a waitSpot with a patient or patientUser', ()=> {
      return request(app)
        .get('/api/waitSpots?join=patient,patientUser')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /:waitSpotId', () => {
    beforeEach(async () => {
      await seedTestWaitSpot();
    });

    test('delete a waitSpot', () => {
      return request(app)
        .delete(`/api/waitSpots/${waitSpotId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });
});
