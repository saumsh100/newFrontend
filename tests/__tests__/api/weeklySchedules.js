
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from './util/generateToken';
import { WeeklySchedule } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import {
  accountId,
  seedTestUsers,
} from '../../util/seedTestUsers';

const weeklyScheduleId = '8ce3ba61-60cd-40c6-bc85-c018cabd4a40';
const weeklySchedule = {
  id: weeklyScheduleId,
  accountId,
  name: 'Test Schedule Seed',
  pmsId: 1,
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestWeeklySchedule() {
  await wipeModel(WeeklySchedule);
  await WeeklySchedule.save(weeklySchedule);
};

describe('/api/weeklySchedules', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
    await wipeModel(WeeklySchedule);
  });

  describe('POST /', () => {
    test('create a weekly schedule', () => {
      const id = '2bd862e8-67ce-4328-8b2a-7df838ddbeea';
      return request(app)
        .post('/api/weeklySchedules')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id,
          accountId,
          name: 'Test Schedule',
          pmsId: 0,
          createdAt: '2017-07-19T00:14:30.932Z',
        })
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestWeeklySchedule();
    });

    test('retrieve weekly schedules', () => {
      return request(app)
        .get('/api/weeklySchedules')
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

  describe('PUT /:weeklyScheduleId', () => {
    beforeEach(async () => {
      await seedTestWeeklySchedule();
    });

    test('update a weekly schedule', () => {
      return request(app)
        .put(`/api/weeklySchedules/${weeklyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
          name: 'Test Schedule Updated',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });
});
