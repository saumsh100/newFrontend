
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import omit from 'lodash/omit';
import { Practitioner, Account, WeeklySchedule } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { practitionerId, practitioner, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { weeklyScheduleId, weeklySchedule, seedTestWeeklySchedules } from '../../util/seedTestWeeklySchedules';
import { omitPropertiesFromBody } from '../../util/selectors';

const accountWithSchedule = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
  weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/practitioners', () => {
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
      await seedTestWeeklySchedules();
      await seedTestPractitioners();
    });

    test('get all practitioners', () => {
      return request(app)
        .get('/api/practitioners')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('get all practitioners with weeklySchedule', () => {
      return request(app)
        .get('/api/practitioners?join=weeklySchedule')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:practitionerId - get a practitioner', () => {
      return request(app)
        .get(`/api/practitioners/${practitionerId}`)
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
      await seedTestUsers();
      await wipeModel(Practitioner);
      await wipeModel(WeeklySchedule);
      await WeeklySchedule.save(weeklySchedule);
      await wipeModel(Account);
      await Account.save(accountWithSchedule);
    });

    test('create practitioner', () => {
      return request(app)
        .post('/api/practitioners')
        .set('Authorization', `Bearer ${token}`)
        .send(practitioner)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['weeklyScheduleId', 'weeklySchedule']);
          const practitioners = body.entities.practitioners;
          const newBody = omit(practitioners, ['weeklySchedules'])
          expect({
            entities: {
              practitioners: newBody,
            },
          }).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestPractitioners();
    });

    test('/:practitionerId - update practitioner', () => {
      return request(app)
        .put(`/api/practitioners/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Updated',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Daily schemas have generated timestamps
    /*
    test.only('/:practitionerId/customSchedule - update weekly schedule', () => {
      const updatedWeeklySchedule = weeklySchedule;
      updatedWeeklySchedule.createdAt = '2017-07-19T00:18:30.932Z';
      return request(app)
        .put(`/api/practitioners/${practitionerId}/customSchedule`)
        .set('Authorization', `Bearer ${token}`)
        .send(Object.assign({ accountId }, weeklySchedule))
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
          console.log(JSON.stringify(body));
        });
    });
    */

  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestPractitioners();
    });

    test('/:practitionerId - delete a practitioner', () => {
      return request(app)
        .delete(`/api/practitioners/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

