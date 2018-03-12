
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  WeeklySchedule,
  Appointment,
  Patient,
  DeliveredProcedure,
} from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import generateToken from '../../_util/generateToken';
import { seedTestUsers, accountId, wipeTestUsers } from '../../_util/seedTestUsers';
import { seedTestPatients, patientId, wipeTestPatients } from '../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId, wipeTestPractitioners } from '../../_util/seedTestPractitioners';
import { seedTestDeliveredProcedures, wipeTestDeliveredProcedures } from '../../_util/seedTestDeliveredProcedures';
import { seedTestProcedures, wipeTestProcedures } from '../../_util/seedTestProcedures';

const rootUrl = '/_api/revenue';

const weeklySchedule = {
  accountId,
  wednesday: {
    isClosed: true,
  },

  saturday: {
    isClosed: true,
  },

  sunday: {
    isClosed: true,
  },

  isAdvanced: false,
};

const makeProcedureData = (data = {}) => Object.assign({
  accountId,
  patientId,
  procedureCode: '11111',
  procedureCodeId: 'CDA-11111',
  isCompleted: true,
}, data);

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();

const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

describe('/api/revenue', () => {
  let token = null;
  beforeEach(async () => {
    await wipeAllModels();
    await wipeTestProcedures();
    await seedTestProcedures();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });

    const ws = await WeeklySchedule.create(weeklySchedule);

    await Account.update({ weeklyScheduleId: ws.get({ plain: true }).id }, { where: {
      id: accountId,
    } });

    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, ...dates(2020, 7, 5, 9), estimatedRevenue: 100 }),
      makeApptData({ patientId: patients[1].id, ...dates(2020, 7, 4, 8), estimatedRevenue: 100 }),
      makeApptData({ patientId: patients[0].id, ...dates(2020, 7, 3, 7), estimatedRevenue: null }),
      makeApptData({ patientId: patients[1].id, ...dates(2020, 7, 2, 6), estimatedRevenue: 0 }),
    ]);

    await DeliveredProcedure.bulkCreate([
      makeProcedureData({ patientId: patients[0].id, entryDate: date(2016, 7, 5, 1), totalAmount: 1000 }),
      makeProcedureData({ patientId: patients[1].id, entryDate: date(2016, 7, 4, 3), totalAmount: 1000 }),
    ]);
  });

  afterAll(async () => {
    await wipeTestDeliveredProcedures();
    await wipeTestProcedures();
    await wipeTestPatients();
    await wipeTestPractitioners();
    await wipeTestUsers();
    await wipeAllModels();
  });

  describe('GET /', () => {
    test('retrieve total revenue for a date in the past', () => {
      return request(app)
        .get(`${rootUrl}/totalRevenueDays?date=${dates(2016, 7, 5, 9).startDate}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          const avg = Math.floor(body.data.average);
          expect(avg).toBe(166);
          expect(body).toMatchSnapshot();
        });
    });

    test('retrieve total revenue for a date in the future', () => {
      return request(app)
        .get(`${rootUrl}/totalRevenueDays?date=${dates(2020, 7, 5, 9).startDate}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          const avg = Math.floor(body.data.average);
          expect(avg).toBe(8);
          expect(body).toMatchSnapshot();
        });
    });

    test.skip('retrieve total revenue for the current day', () => {
      return request(app)
        .get(`${rootUrl}/totalRevenueDays?date=${dates(currentYear, currentMonth, currentDay, 6).startDate}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.data).toBe(1400);
          expect(body).toMatchSnapshot();
        });
    });
  });
});