
import { getPatientsWithAppInRange, countPatientsWithAppInRange } from '../../../../server/lib/patientsQuery/patientsWithinRange';

import { Account, Patient, Appointment } from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

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

const patientFilters = {
  email: {
    $not: null,
  },
};

describe('Patients within Range', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  test('Find Patients due within 5 years', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Future', lastName: 'Patient', email: 'future@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 11, 5), endDate: date(2017, 9, 11, 7) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[2].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[2].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
    ]);

    const patientsData = await getPatientsWithAppInRange(accountId, patientFilters);
    expect(patientsData.length).toBe(3);
  });

  test('Find only active patients', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Inactive' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'New', lastName: 'Patient', email: 'new@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Really New', lastName: 'Patient', email: 'reallyNew@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2017, 9, 11, 5), endDate: date(2017, 9, 11, 7) }),
      makeApptData({ patientId: patients[2].id, startDate: date(2015, 9, 8, 5), endDate: date(2015, 9, 8, 7) }),
      makeApptData({ patientId: patients[3].id, startDate: date(2010, 9, 12, 5), endDate: date(2010, 9, 12, 4) }),
      makeApptData({ patientId: patients[3].id, startDate: date(2019, 9, 12, 5), endDate: date(2019, 9, 12, 4) }),
    ]);

    const patientsData = await getPatientsWithAppInRange(accountId, patientFilters);
    expect(patientsData.length).toBe(2);
  })

  test('Find only patients who had appointments within the last year', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
    ]);

    const patientsData = await getPatientsWithAppInRange(accountId, patientFilters, date(2017, 1, 1, 1), new Date().toISOString());
    expect(patientsData.length).toBe(1);
  });

  test('For no patients in range (Default range)', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2000, 9, 12, 5), endDate: date(2000, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2012, 9, 12, 5), endDate: date(2012, 9, 12, 4) }),
    ]);

    const patientsData = await getPatientsWithAppInRange(accountId, patientFilters);
    expect(patientsData.length).toBe(0);
  });

  test('For no patients in range (1 year)', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
    ]);

    const patientsData = await getPatientsWithAppInRange(accountId, patientFilters, date(2017, 1, 1, 1), new Date().toISOString());
    expect(patientsData.length).toBe(0);
  });

  test('Get count of patients with appointment in range (1 year)', async () => {

    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Future', lastName: 'Patient', email: 'future@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[0].id, startDate: date(2017, 9, 11, 5), endDate: date(2017, 9, 11, 7) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
      makeApptData({ patientId: patients[2].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[2].id, startDate: date(2017, 9, 12, 5), endDate: date(2017, 9, 12, 4) }),
    ]);

    const patientsCount = await countPatientsWithAppInRange(accountId, patientFilters);
    expect(patientsCount).toBe(3);
  });

  test('For count for no patients in range (1 year)', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'old@gmail.com', status: 'Active' }),
      makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'recent@gmail.com', status: 'Active' }),
    ]);

    await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
      makeApptData({ patientId: patients[1].id, startDate: date(2016, 9, 12, 5), endDate: date(2016, 9, 12, 4) }),
    ]);

    const patientsCount = await countPatientsWithAppInRange(accountId, patientFilters, date(2017, 1, 1, 1), new Date().toISOString());
    expect(patientsCount).toBe(0);
  });
});
