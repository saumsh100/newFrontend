
import { Family, Patient } from 'CareCruModels';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import getPatientFromEmail from '../../../../server/lib/contactInfo/getPatientFromEmail';

const makeFamilyData = (data = {}) => Object.assign({ accountId }, data);

const makePatientData = (data = {}) => Object.assign({ accountId }, data);

describe('Contact Info Service', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#getPatientFromEmail', () => {
    test('it should be a function', () => {
      expect(typeof getPatientFromEmail).toBe('function');
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
        makeFamilyData({ pmsCreatedAt: new Date(2015, 1, 1) }),
        makeFamilyData({ pmsCreatedAt: new Date(2014, 1, 1) }),
      ]);

      patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'A', lastName: 'A', email: 'email1@test.com', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
        makePatientData({ firstName: 'B', lastName: 'B', email: 'email2@test.com', familyId: families[0].id, pmsCreatedAt: new Date(2018, 2, 1) }),
        makePatientData({ firstName: 'C', lastName: 'C', email: 'email3@test.com', familyId: families[0].id, pmsCreatedAt: new Date(2018, 3, 1) }),
        makePatientData({ firstName: 'D', lastName: 'D', email: 'email1@test.com', familyId: families[0].id, pmsCreatedAt: new Date(2018, 4, 1) }),
        makePatientData({ firstName: 'E', lastName: 'E', email: 'email1@test.com', familyId: families[1].id, pmsCreatedAt: new Date(2018, 5, 1) }),
        makePatientData({ firstName: 'F', lastName: 'F', email: 'email2@test.com', familyId: families[1].id, pmsCreatedAt: new Date(2018, 6, 1) }),
        makePatientData({ firstName: 'G', lastName: 'G', email: 'email3@test.com', familyId: families[2].id, pmsCreatedAt: new Date(2018, 7, 1) }),

        // Patients with birthDate
        makePatientData({ firstName: 'H', lastName: 'H', email: 'email4@test.com', familyId: families[3].id, pmsCreatedAt: new Date(2018, 8, 1), birthDate: new Date(2017, 8, 1) }),
        makePatientData({ firstName: 'I', lastName: 'I', email: 'email4@test.com', familyId: families[3].id, pmsCreatedAt: new Date(2018, 9, 1), birthDate: new Date(2018, 9, 1) }),
        makePatientData({ firstName: 'J', lastName: 'J', email: 'email5@test.com', familyId: families[4].id, pmsCreatedAt: new Date(2018, 10, 1), birthDate: new Date(2017, 10, 1) }),
        makePatientData({ firstName: 'L', lastName: 'L', email: 'email5@test.com', familyId: families[4].id, pmsCreatedAt: new Date(2018, 11, 1), birthDate: new Date(2018, 11, 1) }),
      ]);

      await families[0].update({ headId: patients[0].id });
      await families[1].update({ headId: patients[4].id });
      await families[2].update({ headId: patients[6].id });
      await families[4].update({ headId: patients[10].id });
    });

    test('Should return patientA because its the family head of the newest family', async () => {
      const email = 'email1@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[0].id);
    });

    test('Should return patientB because its the patient in the newest family', async () => {
      const email = 'email2@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[1].id);
    });

    // TODO: decide if we need to support this?
    // TODO: do we care about older families if information is shared?
    // TODO: how many families in 1 account share the same contact information in its patients?
    // TODO: should group by the patient's number
    test.skip('Should return patientG because its the only family head', async () => {
      const email = 'email3@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[6].id);
    });

    test('Should return null because there are no patients with that number', async () => {
      const email = '+18889991111';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient).toBe(null);
    });

    test('Should return patientE because there is no family data and they are the newest created patient', async () => {
      await Patient.update({ familyId: null }, { where: {} });
      const email = 'email1@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[4].id);
    });

    test('Should return patient H because is the oldest member of the newest created family', async () => {
      const email = 'email4@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[7].id);
    });

    test('Should return patient L because is family head even thought is not the oldest member', async () => {
      const email = 'email5@test.com';
      const patient = await getPatientFromEmail({
        email,
        accountId,
      });
      expect(patient.id).toBe(patients[10].id);
    });
  });
});
