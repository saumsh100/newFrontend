
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import omit from 'lodash/omit';
import { Practitioner, Account, WeeklySchedule, DailySchedule } from '../../../server/_models';
import wipeModel, {  wipeAllModels } from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { practitionerId, practitioner, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { weeklyScheduleId, seedTestFullWeeklySchedules } from '../../util/seedTestWeeklySchedules';
import { omitPropertiesFromBody } from '../../util/selectors';
import filterObject from './chats';

const accountWithSchedule = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
  weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const rootUrl = '/api/practitioners';

const createPractitioner = Object.assign({}, practitioner);
delete createPractitioner.accountId;


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
    beforeAll(async () => {
      await seedTestPractitioners();
    });

    test('get all practitioners', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl']);
          expect(body).toMatchSnapshot();
        });
    });

    test('get all practitioners with weeklySchedule', () => {
      return request(app)
        .get(`${rootUrl}?join=weeklySchedule`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl', 'weeklySchedules', 'startDate']);
          filterObject(body, 'updatedAt');
          filterObject(body, 'createdAt');
          expect(body).toMatchSnapshot();
        });
    });

    test('/:practitionerId - get a practitioner', () => {
      return request(app)
        .get(`${rootUrl}/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:noFetchPractitionerId - get a practitioner with joins', () => {
      return request(app)
        .get(`${rootUrl}/${practitionerId}?join=weeklySchedule`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl', 'weeklySchedules', 'startDate']);
          filterObject(body, 'updatedAt');
          filterObject(body, 'createdAt');
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await seedTestUsers();
      await wipeModel(WeeklySchedule);
      await wipeModel(Practitioner);
      await seedTestFullWeeklySchedules();
      await Account.update({ weeklyScheduleId }, { where: { id: accountId } });
    });

    afterEach(async () => {
      await Account.update({ weeklyScheduleId: null }, { where: { id: accountId } });
      await wipeModel(DailySchedule);
      await wipeModel(Practitioner);
      await wipeModel(WeeklySchedule);
    });

    test('create practitioner', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(createPractitioner)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['weeklyScheduleId', 'weeklySchedule', 'pmsId', 'avatarUrl']);
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
    beforeAll(async () => {
      await seedTestPractitioners();
      await Account.update({ weeklyScheduleId }, { where: { id: accountId } });

    });

    afterAll(async () => {
      await wipeModel(Practitioner);
      await Account.update({ weeklyScheduleId: null }, { where: { id: accountId } });
    });

    test('/:practitionerId - update practitioner', () => {
      return request(app)
        .put(`${rootUrl}/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Updated',
          services: [],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['pmsId', 'avatarUrl']);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Daily schemas have generated timestamps

    // test('/:practitionerId/customSchedule - update weekly schedule', () => {
    //   const updatedWeeklySchedule = weeklySchedule;
    //   updatedWeeklySchedule.createdAt = '2017-07-19T00:18:30.932Z';
    //   return request(app)
    //     .put(`/api/practitioners/${practitionerId}/customSchedule`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(Object.assign({ accountId }, weeklySchedule))
    //     .expect(201)
    //     .then(({ body }) => {
    //       body = omitPropertiesFromBody(body, ['id']);
    //       expect(body).toMatchSnapshot();
    //     });
    // });
  });

  describe('DELETE /', () => {
    beforeAll(async () => {
      await seedTestPractitioners();
    });

    test('/:practitionerId - delete a practitioner then undelete', () => {
      return request(app)
        .delete(`${rootUrl}/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .post(rootUrl)
            .set('Authorization', `Bearer ${token}`)
            .send(createPractitioner)
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body, ['weeklyScheduleId', 'weeklySchedule', 'pmsId', 'avatarUrl']);
              const practitioners = body.entities.practitioners;
              const newBody = omit(practitioners, ['weeklySchedules']);
              expect({
                entities: {
                  practitioners: newBody,
                },
              }).toMatchSnapshot();
            });
        });
    });

    test('/:practitionerId - delete a practitioner', () => {
      return request(app)
        .delete(`${rootUrl}/${practitionerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
