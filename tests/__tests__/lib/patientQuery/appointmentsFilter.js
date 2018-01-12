
import * as appFiltersLibrary from '../../../../server/lib/patientsQuery/appointmentsFilter';

import { Account, Patient, Appointment, DeliveredProcedure, Request, PatientUser } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';
import { seedTestProcedures, wipeTestProcedures } from '../../../_util/seedTestProcedures';
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

describe('Appointment Filters Tests', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await wipeTestProcedures();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestService();
    await seedTestProcedures();
  });

  afterAll(async () => {
    await wipeTestProcedures();
    await wipeAllModels();
  });

  describe('First Last Appointment Filter', () => {
    test('Find Patient with first appointment within these dates', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', firstApptDate: date(2014, 7, 6, 9) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', firstApptDate: date(2013, 7, 6, 9) }),
      ]);

      const data = [date(2014, 7, 5, 8), date(2014, 8, 5, 8)];

      const patientsData = await appFiltersLibrary.FirstLastAppointmentFilter({ data, key: 'firstApptDate' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Find Patient with last appointment within these dates', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: date(2014, 7, 6, 9) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: date(2014, 7, 7, 9) }),
      ]);

      const data = [date(2014, 7, 5, 8), date(2014, 8, 5, 8)];

      const patientsData = await appFiltersLibrary.FirstLastAppointmentFilter({ data, key: 'lastApptDate' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(2);
    });

    test('Find Patient with last appointment, ordered by lastApptDate', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', lastApptDate: date(2014, 7, 6, 9) }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', lastApptDate: date(2014, 7, 7, 9) }),
      ]);

      const data = [date(2014, 7, 5, 8), date(2014, 8, 5, 8)];

      const query = {
        order: [['firstName', 'Desc']],
      };

      const patientsData = await appFiltersLibrary.FirstLastAppointmentFilter({ data, key: 'lastApptDate' }, [], query, accountId);
      expect(patientsData.rows[0].firstName).toBe('Recent');
    });
  });

  describe('Number of Appointments Filter', () => {
    test('Find Patients with number of appointments greater than 3', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 8, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 9, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 10, 5, 9) }),
      ]);

      const data = ['>', 3];

      const patientsData = await appFiltersLibrary.AppointmentsCountFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Find Patients with number of appointments less than 4', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 8, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 9, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 10, 5, 9) }),
        makeApptData({ patientId: patients[1].id, ...dates(2014, 7, 5, 8) }),  // only one appointment for patient 1
      ]);

      const data = ['<', 4];

      const patientsData = await appFiltersLibrary.AppointmentsCountFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
      expect(patientsData.rows[0].id).toBe(patients[1].id);
    });

    test('Find Patients with number of appointments less than 4', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 8, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 9, 5, 9) }),
        makeApptData({ patientId: patients[1].id, ...dates(2014, 7, 5, 8) }),  // only one appointment for patient 1
      ]);

      const data = ['<', 4];
      const query = {
        order: [['firstName', 'Desc']],
      };

      const patientsData = await appFiltersLibrary.AppointmentsCountFilter({ data }, [], query, accountId);
      expect(patientsData.rows.length).toBe(2);
      expect(patientsData.rows[0].firstName).toBe('Recent');
    });
  })

  describe('Production Filter', () => {
    test('Find Patients with production revenue between $500 to $1500', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
      ]);

      const procedure = await DeliveredProcedure.create({
        patientId: patients[0].id,
        accountId,
        entryDate: new Date(),
        procedureCode: '11111',
        procedureCodeId: 'CDA-11111',
        totalAmount: 700,
      });

      const data = [500, 1500];
      const patientsData = await appFiltersLibrary.ProductionFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should find no patients with procedure amounts between $1500 to $2500 ', async () => {
      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
      ]);

      const procedure = await DeliveredProcedure.create({
        patientId: patients[0].id,
        accountId,
        entryDate: new Date(),
        procedureCode: '11111',
        procedureCodeId: 'CDA-11111',
        totalAmount: 700,
      });

      const data = [1500, 2500];
      const patientsData = await appFiltersLibrary.ProductionFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(0);
    });
  });

  describe('Online Appointments Filter', () => {
    test('Find Patients with online appointments greater than or equal to 3', async () => {
      const patientData = await Patient.create(
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
      );

      const patientPlain = patientData.get({ plain: true });

      const patientUser = await PatientUser.create({
        email: 'test@test.com',
        password: 'thisisus',
        firstName: 'Old',
        lastName: 'Patient',
        phoneNumber: '555-555-5555',
      });
      const patientUserPlain = patientUser.get({ plain: true });

      const request = await Request.bulkCreate([{
        accountId,
        serviceId,
        patientUserId: patientUserPlain.id,
        startDate: date(2014, 7, 7, 6),
        endDate: date(2014, 7, 7, 7),
        isConfirmed: true,
      },{
        accountId,
        serviceId,
        patientUserId: patientUserPlain.id,
        startDate: date(2014, 7, 7, 6),
        endDate: date(2014, 7, 7, 7),
        isConfirmed: true,
      },{
        accountId,
        serviceId,
        patientUserId: patientUserPlain.id,
        startDate: date(2014, 7, 7, 6),
        endDate: date(2014, 7, 7, 7),
        isConfirmed: true,
      }]);

      patientPlain.patientUserId = patientUserPlain.id;

      const updatedPatient = await Patient.update(patientPlain, {
        where: {
          id: patientPlain.id,
        },
      });

      const data = ['>=', 3];
      const patientsData = await appFiltersLibrary.OnlineAppointmentsFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });
  });

})
