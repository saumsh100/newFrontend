
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { WeeklySchedule } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { weeklyScheduleId, seedTestWeeklySchedules, officeHourId } from '../../util/seedTestWeeklySchedules';
import { seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody } from '../../util/selectors';
import filterObject from './chats';

const rootUrl = '/api/weeklySchedules';
const id = '8ce3ba61-60cd-40c6-bc85-c018cabd4a44';

function omitProperties(body) {
  filterObject(body, 'updatedAt');
  filterObject(body, 'createdAt');
  filterObject(body, 'id');
  return omitPropertiesFromBody(
    body,
    ['mondayId', 'tuesdayId', 'wednesdayId', 'thursdayId', 'fridayId', 'saturdayId', 'sundayId'],
  );
}

describe('/api/weeklySchedules', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();
    await wipeModel(WeeklySchedule);
    await seedTestWeeklySchedules();
    token = await generateToken({
      username: 'manager@test.com',
      password: '!@CityOfBudaTest#$',
    });
  });

  afterAll(async () => {
    await wipeTestUsers();
    await wipeModel(WeeklySchedule);
  });

  describe('POST /', async () => {
    test('should create a weekly schedule and have the appropriate defaults', () => request(app)
      .post(rootUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({ id })
      .expect(201)
      .then(({ body }) => {
        expect(omitProperties(body)).toMatchSnapshot();
      }));

    test('should create a weekly schedule and use customized daily schedule if provided', () => request(app)
      .post(rootUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id,
        monday: {
          startTime: '1996-08-02T16:00:00.000Z',
          endTime: '1996-08-03T16:00:00.000Z',
        },
      })
      .expect(201)
      .then(({ body }) => {
        expect(omitProperties(body)).toMatchSnapshot();
      }));

    test('should create a weekly schedule with monday closed if provided startTime equals to endTime', () =>
      request(app).post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id,
          monday: {
            startTime: '1996-08-02T16:00:00.000Z',
            endTime: '1996-08-02T16:00:00.000Z',
          },
        })
        .expect(201)
        .then(({ body }) => {
          expect(omitProperties(body)).toMatchSnapshot();
        }));
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
    test('should update a weekly schedule', () => request(app)
      .put(`${rootUrl}/${weeklyScheduleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isAdvanced: true })
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        expect(body).toMatchSnapshot();
      }));

    test('should update monday dailySchedule for weeklySchedule if provided', () => request(app)
      .put(`${rootUrl}/${officeHourId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        monday: {
          startTime: '2008-01-31T16:00:00.000Z',
          endTime: '2008-02-01T01:00:00.000Z',
        },
      })
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        filterObject(body, 'updatedAt');
        filterObject(body, 'createdAt');
        expect(body).toMatchSnapshot();
      }));

    test('should update monday and set the startTime equal to endTime for weeklySchedule if isClosed for monday is set to be true', () =>
      request(app)
        .put(`${rootUrl}/${officeHourId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ monday: { isClosed: true } })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          filterObject(body, 'updatedAt');
          filterObject(body, 'createdAt');
          expect(body).toMatchSnapshot();
        }));
  });
});
