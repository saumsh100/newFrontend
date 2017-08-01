
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import omit from 'lodash/omit';
import { Practitioner, Account, WeeklySchedule } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../_util/seedTestUsers';
import { practitionerId, practitioner, seedTestPractitioners } from '../../_util/seedTestPractitioners';
import { weeklyScheduleId, weeklySchedule, seedTestWeeklySchedules } from '../../_util/seedTestWeeklySchedules';
import { omitProperties, omitPropertiesFromBody } from '../../util/selectors';

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
        .get('/_api/practitioners')
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

    test.only('get all practitioners with weeklySchedule', () => {
      return request(app)
        .get('/_api/practitioners?join=weeklySchedule')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          const pracKey = Object.keys(body.entities.practitioners)[0];
          const schKey = Object.keys(body.entities.weeklySchedules)[0];
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl', 'weeklySchedules', 'startDate']);
          delete body.entities.weeklySchedules.startDate;
          body.entities.weeklySchedules[schKey].accountId = body.entities.practitioners[pracKey].accountId;

          body.entities.weeklySchedules[schKey].friday.chairIds = [];
          body.entities.weeklySchedules[schKey].friday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].saturday.chairIds = [];
          body.entities.weeklySchedules[schKey].saturday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].sunday.chairIds = [];
          body.entities.weeklySchedules[schKey].sunday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].monday.chairIds = [];
          body.entities.weeklySchedules[schKey].monday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].tuesday.chairIds = [];
          body.entities.weeklySchedules[schKey].tuesday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].wednesday.chairIds = [];
          body.entities.weeklySchedules[schKey].wednesday.pmsScheduleId = null;
          body.entities.weeklySchedules[schKey].thursday.chairIds = [];
          body.entities.weeklySchedules[schKey].thursday.pmsScheduleId = null;

          expect(body).toMatchSnapshot();
        });
    });

    test('/:practitionerId - get a practitioner', () => {
      return request(app)
        .get(`/_api/practitioners/${practitionerId}`)
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
        .post('/_api/practitioners')
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
        .put(`/_api/practitioners/${practitionerId}`)
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
        .delete(`/_api/practitioners/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
