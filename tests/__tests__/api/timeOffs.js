
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { PractitionerTimeOff } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';

const practitionerTimeOffId = '46344262-9039-47fa-a4e6-d762dcc57308';
const practitionerTimeOff = {
  id: practitionerTimeOffId,
  practitionerId,
  startDate: '2017-07-19T00:16:30.932Z',
  endDate: '2017-07-19T00:17:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestPractitionerTimeOffs() {
  await seedTestPractitioners();
  await wipeModel(PractitionerTimeOff);
  PractitionerTimeOff.save(practitionerTimeOff);
}

describe('/api/timeOffs', () => {
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
      await seedTestPractitionerTimeOffs();
    });

    test('get all practitioner time offs', () => {
      return request(app)
        .get('/api/timeOffs')
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
    beforeEach(async () => {
      await wipeModel(PractitionerTimeOff);
    });

    test('create time off', () => {
      return request(app)
        .post('/api/timeOffs')
        .set('Authorization', `Bearer ${token}`)
        .send(practitionerTimeOff)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestPractitionerTimeOffs();
    });

    test('/:timeOffId - update a time off', () => {
      return request(app)
        .put(`/api/timeOffs/${practitionerTimeOffId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          endDate: '2017-07-19T00:18:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestPractitionerTimeOffs();
    });

    test('/:timeOffId - delete a time off', () => {
      return request(app)
        .delete(`/api/timeOffs/${practitionerTimeOffId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });
});

