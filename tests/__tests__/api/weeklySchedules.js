
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { WeeklySchedule } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import { weeklyScheduleId, seedTestWeeklySchedules } from '../../util/seedTestWeeklySchedules';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { getModelsArray, omitPropertiesFromBody }  from '../../util/selectors';

const rootUrl = '/api/weeklySchedules';

describe('/api/weeklySchedules', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(WeeklySchedule);
    await seedTestUsers();
    await seedTestWeeklySchedules();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(WeeklySchedule);
    await wipeTestUsers();
  });

  describe('POST /', () => {
    test('should create a weekly schedule and have the appropriate defaults', () => {
      const id = '2bd862e8-67ce-4328-8b2a-7df838ddbeea';
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({ id })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  // TODO: Diff debug
  /*
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
  */

  describe('PUT /:weeklyScheduleId', () => {
    test('update a weekly schedule', () => {
      return request(app)
        .put(`/api/weeklySchedules/${weeklyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isAdvanced: true })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
