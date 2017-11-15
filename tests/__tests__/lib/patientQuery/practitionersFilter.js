import * as practitionersFiltersLibrary from '../../../../server/lib/patientsQuery/practitionersFilter';

import { Account, Patient, Appointment } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

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

describe('Practitioners Filter Tests', () => {
  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Practitioners Filter Function', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
    });

    test('Should have 3 patients who have had appointments with this practitioner', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', birthDate: date(1998, 2, 6, 9)}),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', birthDate: date(1990, 7, 6, 9)}),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', birthDate: date(1890, 7, 6, 9)}),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[1].id, ...dates(2014, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 8, 5, 9) }),
        makeApptData({ patientId: patients[2].id, ...dates(2016, 9, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 10, 5, 9) }),
      ]);

      const data = [practitionerId];

      const patientsData = await practitionersFiltersLibrary.PractitionersFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(3);
    });

    test('Should have 1 patient who have had appointments with this practitioner', async () => {

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', birthDate: date(1998, 2, 6, 9)}),
        makePatientData({ firstName: 'Kind Of Old', lastName: 'Patient', birthDate: date(1990, 7, 6, 9)}),
        makePatientData({ firstName: 'Very Old', lastName: 'Patient', birthDate: date(1890, 7, 6, 9)}),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 8, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 9, 5, 9) }),
        makeApptData({ patientId: patients[0].id, ...dates(2016, 10, 5, 9) }),
      ]);

      const data = [practitionerId];

      const patientsData = await practitionersFiltersLibrary.PractitionersFilter({ data }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

  });
});
