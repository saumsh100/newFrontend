
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { PractitionerRecurringTimeOff, DailySchedule, Practitioner } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { omitPropertiesFromBody } from '../../util/selectors';

const dailyScheduleId = '46344262-9039-47fa-a4e6-d762dcc57308';
const dailySchedule = {
  id: dailyScheduleId,
  practitionerId,
  pmsId: '12',
  date: '2017-12-12',
  startTime: '2017-07-19T00:16:30.932Z',
  endTime: '2017-07-19T00:17:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const rootUrl = '/api/dailySchedules';

async function seedTestPractitionerDailySchedules() {
  await wipeModel(DailySchedule);
  await wipeModel(Practitioner);
  await seedTestPractitioners();
  await DailySchedule.create(dailySchedule);
}

describe('/api/dailySchedule', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(DailySchedule);
      await wipeModel(Practitioner);
      await seedTestPractitioners();
    });

    test('create dailySchedule', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(dailySchedule)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('create dailySchedule - json api', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .send(dailySchedule)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body).toMatchSnapshot();
        });
    });

    test('create dailySchedule batch - json api', () => {
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .send([dailySchedule])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestPractitionerDailySchedules();
    });

    test('/:dailyScheduleId - delete a dailySchedule', () => {
      return request(app)
        .delete(`${rootUrl}/${dailyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:dailyScheduleId - delete a daily schedule Id then undelete it', () => {
      return request(app)
        .delete(`${rootUrl}/${dailyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .post(rootUrl)
            .set('Authorization', `Bearer ${token}`)
            .send(dailySchedule)
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(body).toMatchSnapshot();
            });
        });
    });

    test('/:dailyScheduleId - delete a daily schedule Id then undelete it with batch', () => {
      return request(app)
        .delete(`${rootUrl}/${dailyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
              .post(`${rootUrl}/connector/batch`)
              .set('Authorization', `Bearer ${token}`)
              .set('Accept', 'application/vnd.api+json')
              .send([dailySchedule])
              .expect(201)
              .then(({ body }) => {
                body = omitPropertiesFromBody(body, [], true);
                expect(body).toMatchSnapshot();
              });
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestPractitionerDailySchedules();
    });

    test('/:dailyScheduleId - update a daily schedule', () => {
      return request(app)
        .put(`${rootUrl}/${dailyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          startTime: '2017-07-19T00:18:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:dailyScheduleId - update a daily schedule - json api', () => {
      return request(app)
        .put(`${rootUrl}/${dailyScheduleId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          startTime: '2017-07-19T00:18:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:dailyScheduleId/batch - update a daily schedule - json api', () => {
      return request(app)
        .put(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .send([{
          id: dailyScheduleId,
          startTime: '2017-07-19T00:18:30.932Z',
        }])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
