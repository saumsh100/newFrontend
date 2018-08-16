
import {
  Appointment,
  Patient,
  DeliveredProcedure,
  WeeklySchedule,
  Account,
} from '../../../../server/_models';
import calcRevenueDays from '../../../../server/lib/revenue/index';
import { seedTestUsers, accountId, wipeTestUsers } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId, wipeTestPatients } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId, wipeTestPractitioners } from '../../../util/seedTestPractitioners';
import { seedTestProcedures, wipeTestProcedures } from '../../../util/seedTestProcedures';
import { wipeTestDeliveredProcedures } from '../../../util/seedTestDeliveredProcedures';
import { wipeTestWeeklySchedules } from '../../../util/seedTestWeeklySchedules';
import { wipeAllModels } from '../../../util/wipeModel';

const makeProcedureData = (data = {}) => Object.assign({
  accountId,
  patientId,
  procedureCode: '11111',
  procedureCodeId: 'CDA-11111',
  isCompleted: true,
}, data);

const weeklySchedule = {
  accountId,
  wednesday: { isClosed: true },

  saturday: { isClosed: true },

  sunday: { isClosed: true },

  isAdvanced: false,
};

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({ accountId }, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

const currentDateMinusDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);

  return d;
};

const currentDatePlusDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);

  return d;
};

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

describe('#Calculate total revenue for a date range', () => {
  let patients;

  beforeEach(async () => {
    await wipeAllModels();
    await wipeTestProcedures();
    await seedTestProcedures();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    patients = await Patient.bulkCreate([
      makePatientData({
        firstName: 'Old',
        lastName: 'Patient',
      }),
      makePatientData({
        firstName: 'Recent',
        lastName: 'Patient',
      }),
    ]);
    const ws = await WeeklySchedule.create(weeklySchedule);

    await Account.update({ weeklyScheduleId: ws.get({ plain: true }).id }, { where: { id: accountId } });
  });

  afterAll(async () => {
    await wipeTestDeliveredProcedures();
    await wipeTestProcedures();
    await wipeTestPatients();
    await wipeTestPractitioners();
    await wipeTestUsers();
    await wipeAllModels();
  });

  test('For a date in the future calculate the estimated revenue, with closed clinic dates', async () => {
    await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        startDate: date(2018, 9, 12, 5),
        endDate: date(2018, 9, 12, 4),
        estimatedRevenue: 500,
      }),
      makeApptData({
        patientId: patients[0].id,
        startDate: date(2018, 9, 12, 5),
        endDate: date(2018, 9, 12, 4),
        estimatedRevenue: 500,
      }),
      makeApptData({
        patientId: patients[0].id,
        startDate: date(2018, 9, 11, 5),
        endDate: date(2018, 9, 11, 7),
        estimatedRevenue: 500,
      }),
      makeApptData({
        patientId: patients[0].id,
        startDate: date(2018, 9, 8, 5),
        endDate: date(2018, 9, 8, 7),
        estimatedRevenue: 0,
      }),
    ]);

    await DeliveredProcedure.bulkCreate([
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2018, 9, 12, 5),
        totalAmount: 700,
      }),
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2018, 9, 12, 5),
        totalAmount: 700,
      }),
    ]);

    const query = {
      date: date(2018, 9, 12, 5),
      accountId,
      maxDates: 12,
      pastDaysLimit: 30,
    };

    const total = await calcRevenueDays(query);
    expect(Math.floor(total.average)).toBe(500);
  });

  test('For a date in the past calculate the total revenue based on delivered procedures only', async () => {
    await DeliveredProcedure.bulkCreate([
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2016, 7, 5, 8),
        totalAmount: 700,
      }),
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2016, 7, 4, 1),
        totalAmount: 300,
      }),
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2016, 7, 3, 10),
        totalAmount: 500,
      }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 8),
        estimatedRevenue: 500,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 4, 8),
        estimatedRevenue: 500,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 3, 8),
        estimatedRevenue: 500,
      }),
    ]);

    const query = {
      date: date(2016, 7, 5, 9),
      accountId,
      maxDates: 12,
      pastDaysLimit: 30,
    };

    const total = await calcRevenueDays(query);
    expect(Math.floor(total.average)).toBe(500);
  });

  test('0 estimated revenue', async () => {
    await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        startDate: currentDatePlusDays(7),
        endDate: currentDatePlusDays(7),
        estimatedRevenue: 200,
      }),
    ]);

    const query = {
      date: currentDatePlusDays(6),
      accountId,
      maxDates: 12,
      pastDaysLimit: 30,
    };

    const total = await calcRevenueDays(query);
    expect(total.average).toBe(0);
  });

  test('0 delivered procedures', async () => {
    await DeliveredProcedure.bulkCreate([
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2019, 7, 5, 1),
        totalAmount: 1000,
      }),
      makeProcedureData({
        patientId: patients[1].id,
        entryDate: date(2016, 7, 4, 1),
        totalAmount: 1000,
      }),
    ]);

    const query = {
      date: date(2016, 7, 3, 9),
      accountId,
      maxDates: 12,
      pastDaysLimit: 30,
    };

    const total = await calcRevenueDays(query);
    expect(total.average).toBe(0);
  });
});
