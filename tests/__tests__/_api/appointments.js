
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { Appointment, Account, WeeklySchedule } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { wipeTestPatients } from '../../_util/seedTestPatients';
import { wipeTestPractitioners } from '../../_util/seedTestPractitioners';
import { patientId } from '../../_util/seedTestPatients';
import { appointment, appointmentId, seedTestAppointments } from '../../_util/seedTestAppointments';
import { weeklyScheduleId, seedTestWeeklySchedules } from '../../_util/seedTestWeeklySchedules';
import { practitionerId } from '../../_util/seedTestPractitioners';
import { omitPropertiesFromBody } from '../../util/selectors';

const batchAppointmentId = '04148c65-292d-4d06-8801-d8061cec7b12';
const batchAppointmentId2 = '6ee224d6-8e66-4cb8-9d41-8964a3d9b909';
const batchAppointmentId3 = 'f3905556-45f7-406d-ba5a-dabe02288665';
const batchAppointmentId4 = 'bd7a83d3-c1f2-40c5-8cb9-7e3b4362194a';
const invalidBatchAppointmentId = '61073a69-085c-4646-9dc0-2ad85a0b94fb';

const rootUrl = '/_api/appointments';

const accountWithSchedule = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
  weeklyScheduleId,
  timezone: 'America/Vancouver',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const batchAppointment = {
  id: batchAppointmentId,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const batchAppointment2 = {
  id: batchAppointmentId2,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const batchAppointment3 = {
  id: batchAppointmentId3,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const batchAppointment4 = {
  id: batchAppointmentId4,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const invalidBatchAppointment = {
  id: invalidBatchAppointmentId,
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/appointments', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();
    await seedTestAppointments();
    await Account.update({ weeklyScheduleId }, { where: { id: accountId } }).catch(err => console.log(err));
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Account);
    await wipeModel(WeeklySchedule);
    await wipeModel(Appointment);
    await wipeTestPatients();
    await wipeTestPractitioners();
    await wipeTestUsers();
    await wipeAllModels();
  });

  // TODO: This can use some more test cases... (Gavin: Not familiar with what's going on in these endpoints)
  describe('GET /', () => {
    test('/business - [no description]', () => {
      return request(app)
        .get(`${rootUrl}/business?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/statsdate - data for most popular day of the week', () => {
      return request(app)
        .get(`${rootUrl}/statsdate`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/statslastyear - data for past year', () => {
      return request(app)
        .get(`${rootUrl}/statslastyear`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/stats - appointment stats for intelligence overview', () => {
      return request(app)
        .get(`${rootUrl}/stats?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - retrieve appointments', () => {
      return request(app)
        .get(`${rootUrl}?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - retrieve appointments - pms not synced', () => {
      return request(app)
        .get(`${rootUrl}/connector/notSynced`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:appointmentId - retrieve an appointment', () => {
      return request(app)
        .get(`${rootUrl}/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - retrieve appointments - return nothing - pms not synced', async () => {
      await Appointment.update({ isSyncedWithPms: true }, { where: { id: '6b215a42-5c33-4f94-8313-d89893ae2f36' } });
      return request(app)
        .get(`${rootUrl}/connector/notSynced`)
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
      await wipeModel(Appointment);
    });

    test('/ - create an appointment', () => {
      const createAppointment = Object.assign({}, appointment);
      appointment.accountId;
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(createAppointment)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - create a short Cancel - both cancelled fields should be true', () => {
      const createAppointment = Object.assign({ isShortCancelled: true }, appointment);
      appointment.accountId;
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(createAppointment)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - create a Cancel - only isCancelled field should be true not isShortCancelled', () => {
      const createAppointment = Object.assign({ isCancelled: true }, appointment);
      appointment.accountId;
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(createAppointment)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });


    test('/batch - 4 appointments created successfully', () => {
      return request(app)
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          appointments: [batchAppointment, batchAppointment2, batchAppointment3, batchAppointment4],
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.appointments).length).toBe(4);
        });
    });


    test('/batch - 1 invalid appointment, 3 valid appointments', () => {
      return request(app)
        .post(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          appointments: [invalidBatchAppointment, batchAppointment2, batchAppointment3, batchAppointment4],
        })
        .expect(400)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.appointments).length).toBe(3);
        });
    });
  });


  describe('PUT /', () => {

    test('/batch - update 1 appointment', () => {
      const updateAppointment = appointment;
      appointment.isReminderSent = false;
      return request(app)
        .put(`${rootUrl}/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          appointments:
            [updateAppointment],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.appointments).length).toBe(1);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:appointmentId - update appointment', () => {
      return request(app)
        .put(`${rootUrl}/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          isSyncedWithPms: true,
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    test('/:appointmentId - delete appointment', () => {
      return request(app)
        .delete(`${rootUrl}/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:appointmentId - delete appointment then undelete it', () => {
      return request(app)
        .delete(`${rootUrl}/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          const appointmentCreate = {
            startDate: '2017-01-21T00:14:30.932Z',
            endDate: '2017-01-21T00:14:30.932Z',
            patientId,
            practitionerId,
            pmsId: '12',
            isSyncedWithPms: false,
            isReminderSent: true,
            isDeleted: false,
            createdAt: '2017-07-19T00:14:30.932Z',
          };
          return request(app)
                  .post(rootUrl)
                  .set('Authorization', `Bearer ${token}`)
                  .send(appointmentCreate)
                  .expect(201)
                  .then(({ body }) => {
                    body = omitPropertiesFromBody(body);
                    expect(body).toMatchSnapshot();
                  });
        });
    });
  });
});
