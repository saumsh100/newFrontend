import * as demographicsFiltersLibrary from '../../../../server/lib/patientsQuery/demographicsFilter';

import { Account, Patient, Appointment } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';


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

describe('Demograph Filters Tests', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
  });

  afterAll(async () => {
    await wipeAllModels();
  });


  describe('Demographics Filter Function', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
    });

    test('Find (2) Patients between these 18 and 36 years of age', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', birthDate: date(1998, 2, 6, 9)}),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', birthDate: date(1990, 7, 6, 9)}),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', birthDate: date(1890, 7, 6, 9)}),
      ]);

      const data = [18, 36];

      const patientsData = await demographicsFiltersLibrary.DemographicsFilter({data, key: 'age'}, [], {}, accountId);
      expect(patientsData.rows.length).toBe(2);
    });

    test('Find (3) Patients from the city of victoria', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', address: { city: 'vancouver' } }),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', address: { city: 'victoria' } }),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', address: { city: 'victoria' } }),
        makePatientData({ firstName: 'Super Old', lastName: 'Patient', address: { city: 'victoria' } }),
      ]);

      const data = ['victoria'];

      const patientsData = await demographicsFiltersLibrary.DemographicsFilter({ data, key: 'city' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(3);
    });

    test('Find (4) male patients', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', gender: 'Male' }),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', gender: 'male' }),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', gender: 'male' }),
        makePatientData({ firstName: 'Super Old', lastName: 'Patient', gender: 'Male' }),
      ]);

      const data = ['Male'];

      const patientsData = await demographicsFiltersLibrary.DemographicsFilter({ data, key: 'Male' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(4);
    });

    test('Find (4) male patients order by firstName', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', gender: 'Male' }),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', gender: 'male' }),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', gender: 'male' }),
        makePatientData({ firstName: 'Super Old', lastName: 'Patient', gender: 'Male' }),
      ]);

      const data = ['Male'];
      const query = {
        order: [['firstName', 'Desc']],
      };
      const patientsData = await demographicsFiltersLibrary.DemographicsFilter({ data, key: 'Male' }, [], query, accountId);
      expect(patientsData.rows.length).toBe(4);
      expect(patientsData.rows[0].firstName).toBe('Very Old');
    });
  });
});
