
import { Family, Patient } from 'CareCruModels';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { getPatientFromCellPhoneNumber } from '../../../../server/lib/contactInfo/getPatientFromCellPhoneNumber';

const makeFamilyData = (data = {}) => Object.assign({
  accountId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

describe('Contact Info Service', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#getPatientFromCellPhoneNumber', () => {
    test('it should be a function', () => {
      expect(typeof getPatientFromCellPhoneNumber).toBe('function');
    });

    let families;
    let patients;
    beforeEach(async () => {
      // Seed Families
      // Seed Patients
      families = await Family.bulkCreate([
        makeFamilyData({ pmsCreatedAt: new Date(2018, 1, 1) }),
        makeFamilyData({ pmsCreatedAt: new Date(2017, 1, 1) }),
        makeFamilyData({ pmsCreatedAt: new Date(2016, 1, 1) }),
      ]);

      patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'A', lastName: 'A', mobilePhoneNumber: '+18881112222', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
        makePatientData({ firstName: 'B', lastName: 'B', mobilePhoneNumber: '+18882223333', familyId: families[0].id, pmsCreatedAt: new Date(2018, 2, 1) }),
        makePatientData({ firstName: 'C', lastName: 'C', mobilePhoneNumber: '+18883334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 3, 1) }),
        makePatientData({ firstName: 'D', lastName: 'D', mobilePhoneNumber: '+18881112222', familyId: families[0].id, pmsCreatedAt: new Date(2018, 4, 1) }),
        makePatientData({ firstName: 'E', lastName: 'E', mobilePhoneNumber: '+18881112222', familyId: families[1].id, pmsCreatedAt: new Date(2018, 5, 1) }),
        makePatientData({ firstName: 'F', lastName: 'F', mobilePhoneNumber: '+18882223333', familyId: families[1].id, pmsCreatedAt: new Date(2018, 6, 1) }),
        makePatientData({ firstName: 'G', lastName: 'G', mobilePhoneNumber: '+18883334444', familyId: families[2].id, pmsCreatedAt: new Date(2018, 7, 1) }),
      ]);

      await families[0].update({ headId: patients[0].id });
      await families[1].update({ headId: patients[4].id });
      await families[2].update({ headId: patients[6].id });
    });

    test('Should return patientA because its the family head of the newest family', async () => {
      const cellPhoneNumber = '+18881112222';
      const patient = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
      expect(patient.id).toBe(patients[0].id);
    });

    test('Should return patientB because its the patient in the newest family', async () => {
      const cellPhoneNumber = '+18882223333';
      const patient = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
      expect(patient.id).toBe(patients[1].id);
    });

    // TODO: decide if we need to support this?
    // TODO: do we care about older families if information is shared?
    // TODO: how many families in 1 account share the same contact information in its patients? should group by the patient's number
    test.skip('Should return patientG because its the only family head', async () => {
      const cellPhoneNumber = '+18883334444';
      const patient = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
      expect(patient.id).toBe(patients[6].id);
    });

    test('Should return null because there are no patients with that number', async () => {
      const cellPhoneNumber = '+18889991111';
      const patient = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
      expect(patient).toBe(null);
    });

    test('Should return patientE because there is no family data and they are the newest created patient', async () => {
      await Patient.update({ familyId: null }, { where: {} });
      const cellPhoneNumber = '+18881112222';
      const patient = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
      expect(patient.id).toBe(patients[4].id);
    });
  });
});
