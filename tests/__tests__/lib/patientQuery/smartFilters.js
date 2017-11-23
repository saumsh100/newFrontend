
import * as smartFiltersLibrary from '../../../../server/lib/patientsQuery/smartFilters';

import { Account, Patient, Appointment } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';
import { serviceId, seedTestService } from '../../../_util/seedTestServices';


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

const currentDateMinusDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);

  return d;
}

describe('Smart Filters Tests', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Last Appointment Filter', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
    });

    test('Find Patients due within 60 days', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: currentDateMinusDays(220) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: date(2013, 7, 6, 9) }),
      ]);

      const smFilter = {
        startMonth: 8,
        endMonth: 7,
      };

      const patientsData = await smartFiltersLibrary.LateAppointmentsFilter(accountId, {}, smFilter);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should Fail because there is a nextApptDate', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: date(2017, 3, 10, 9), nextApptDate: date(2017, 12, 10, 9) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: date(2013, 7, 6, 9) }),
      ]);

      const smFilter = {
        startMonth: 8,
        endMonth: 7,
      };

      const patientsData = await smartFiltersLibrary.LateAppointmentsFilter(accountId, {}, smFilter);
      expect(patientsData.rows.length).toBe(0);
    });

    test('Find Patients late 13-18 months', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: currentDateMinusDays(730) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: currentDateMinusDays(760) }),
      ]);

      const smFilter = {
        startMonth: 26,
        endMonth: 21,
      };

      const patientsData = await smartFiltersLibrary.LateAppointmentsFilter(accountId, {}, smFilter);
      expect(patientsData.rows.length).toBe(2);
    });
  });

  describe('Cancelled Appointment Filter', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
    });

    test('Find all cancelled patients within the last 48 hours', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
      ]);

      await Appointment.bulkCreate([
        makeApptData({
          patientId: patients[0].id,
          startDate: currentDateMinusDays(1),
          endDate: currentDateMinusDays(1),
          isCancelled: true,
        }),
        makeApptData({
          patientId: patients[1].id,
          ...dates(2017, 10, 14, 5),
        }),
      ]);

      const patientsData = await smartFiltersLibrary.CancelledAppointmentsFilter(accountId, {}, {});
      expect(patientsData.rows.length).toBe(1);
    });
    test('Find all cancelled patients within the last 48 hours, should be 0', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
      ]);

      await Appointment.bulkCreate([
        makeApptData({
          patientId: patients[0].id,
          startDate: currentDateMinusDays(1),
          endDate: currentDateMinusDays(1),
          isCancelled: false,
        }),
        makeApptData({
          patientId: patients[1].id,
          ...dates(2017, 10, 14, 5),
        }),
      ]);

      const patientsData = await smartFiltersLibrary.CancelledAppointmentsFilter(accountId, {}, {});
      expect(patientsData.rows.length).toBe(0);
    });
  });

  describe('Missed PreAppointed Filter', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
    });

    test('Find all patients with last appointment in the last 30 days and no next appointment', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: currentDateMinusDays(20) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
      ]);

      const patientsData = await smartFiltersLibrary.MissedPreAppointed(accountId, {}, {});
      expect(patientsData.rows.length).toBe(1);
    });

    test('should fail because there is a next appt and not in 30 days ', async () => {
      await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: date(2017, 10, 10, 9), nextApptDate: date(2017, 12, 10, 9) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: date(2017, 7, 10, 9), nextApptDate: date(2017, 12, 10, 9) }),
      ]);

      const patientsData = await smartFiltersLibrary.MissedPreAppointed(accountId, {}, {});
      expect(patientsData.rows.length).toBe(0);
    });
  });

  describe('Unconfirmed Patients Filter within 7 or 14 days', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
    });

    test('Find all patients that have not confirmed appointments that are within the next 7 days', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
      ]);

      const d = new Date();
      d.setDate(d.getDate() + 5);

      const appointments = await Appointment.bulkCreate([
        makeApptData({
          patientId: patients[0].id,
          startDate: d,
          endDate: d,
          isPatientConfirmed: false,
        }),
        makeApptData({
          patientId: patients[1].id,
          startDate: d,
          endDate: d,
          isPatientConfirmed: true,
        }),
      ]);

      const patientPlain = patients[0].get({ plain: true });
      const appPlain = appointments[0].get({ plain: true });

      const patientPlain1 = patients[1].get({ plain: true });
      const appPlain1 = appointments[1].get({ plain: true });

      patientPlain.nextApptId = appPlain.id;
      patientPlain1.nextApptId = appPlain1.id;

      await Patient.update(patientPlain, {
        where: {
          id: patientPlain.id,
        },
      });

      await Patient.update(patientPlain1, {
        where: {
          id: patientPlain1.id,
        },
      });

      const patientsData = await smartFiltersLibrary.UnConfirmedPatientsFilter(accountId, {}, { days: 7 });
      expect(patientsData.rows.length).toBe(1);
    });
  });
});
