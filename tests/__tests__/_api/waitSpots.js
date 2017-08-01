
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { WaitSpot } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, seedTestUsers } from '../../_util/seedTestUsers';
import { patientId, patientUserId, seedTestPatients } from '../../_util/seedTestPatients';
import { getModelsArray, omitPropertiesFromBody }  from '../../util/selectors';


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
};

describe('/api/waitSpots', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(WaitSpot);
    await seedTestUsers();
    await seedTestWaitSpot();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    test('retrieve a waitSpot', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['unavailableDays']);
          expect(body).toMatchSnapshot();
        });
    });

    /*
    test('retrieve waitSpots with a patient or patientUser', ()=> {
      return request(app)
        .get('/api/waitSpots?join=patient,patientUser')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });*/
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
  });

  describe('PUT /:waitSpotId', () => {
    test('update a waitSpot', () => {
      return request(app)
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
        });
    });
  });

  describe('DELETE /:waitSpotId', () => {
    test('delete a waitSpot', () => {
      return request(app)
        .delete(`${rootUrl}/${waitSpotId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

  });
});
