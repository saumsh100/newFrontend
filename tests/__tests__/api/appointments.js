
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Appointment, Account } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId } from '../../util/seedTestPatients';
import { appointment, appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';
import { weeklyScheduleId, seedTestWeeklySchedules } from '../../util/seedTestWeeklySchedules';
import { practitionerId } from '../../util/seedTestPractitioners';
import { omitPropertiesFromBody } from '../../util/selectors';

const batchAppointmentId = '04148c65-292d-4d06-8801-d8061cec7b12';
const batchAppointmentId2 = '6ee224d6-8e66-4cb8-9d41-8964a3d9b909';
const batchAppointmentId3 = 'f3905556-45f7-406d-ba5a-dabe02288665';
const batchAppointmentId4 = 'bd7a83d3-c1f2-40c5-8cb9-7e3b4362194a';
const invalidBatchAppointmentId = '61073a69-085c-4646-9dc0-2ad85a0b94fb';

const accountWithSchedule = {
  id: accountId,
  enterpriseId,
  name: 'Test Account',
  weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const batchAppointment = {
  id: batchAppointmentId,
  startDate: '2017-07-21T00:14:30.932Z',
  endDate: '2017-07-21T00:16:30.932Z',
  accountId,
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
  accountId,
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
  accountId,
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
  accountId,
  patientId,
  practitionerId,
  isSyncedWithPms: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const invalidBatchAppointment = {
  id: invalidBatchAppointmentId,
  accountId,
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
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  // TODO: This can use some more test cases... (Gavin: Not familiar with what's going on in these endpoints)
  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestUsers();
      await seedTestWeeklySchedules();
      await wipeModel(Account);
      await Account.save(accountWithSchedule);
      await seedTestAppointments();
    });

    test('/business - [no description]', () => {
      return request(app)
        .get('/api/appointments/business?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/statsdate - data for most popular day of the week', () => {
      return request(app)
        .get('/api/appointments/statsdate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/statslastyear - data for past year', () => {
      return request(app)
        .get('/api/appointments/statslastyear')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/stats - appointment stats for intelligence overview', () => {
      return request(app)
        .get('/api/appointments/stats?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - retrieve appointments', () => {
      return request(app)
        .get('/api/appointments?startDate=2016-07-19T00:14:30.932Z&endDate=2018-07-19T00:14:30.932Z')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:appointmentId - retrieve an appointment', () => {
      return request(app)
        .get(`/api/appointments/${appointmentId}`)
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
      return request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointment)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/batch - 4 appointments created successfully', () => {
      return request(app)
        .post('/api/appointments/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          appointments: [batchAppointment, batchAppointment2, batchAppointment3, batchAppointment4],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.appointments).length).toBe(4);
        });
    });

    test('/batch - 1 invalid appointment, 3 valid appointments', () => {
      return request(app)
        .post('/api/appointments/batch')
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
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/batch - update 1 appointment', () => {
      const updateAppointment = appointment;
      appointment.isReminderSent = false;
      return request(app)
        .put('/api/appointments/batch')
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
        .put(`/api/appointments/${appointmentId}`)
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
    beforeEach(async () => {
      await seedTestAppointments();
    });

    test('/:appointmentId - delete appointment', () => {
      return request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
