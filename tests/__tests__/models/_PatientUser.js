
import { Account, Patient, PatientUser } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';

async function wipePatientUserTable() {
  await PatientUser.destroy({
    where: {},
    force: true,
  });
}

async function wipePatientTable() {
  await Patient.destroy({
    where: {},
    force: true,
  });
}

async function wipeAccountTable() {
  await Account.destroy({
    where: {},
    force: true,
  });
}

const accountId = 'e13151a6-091e-43db-8856-7e547c171754';
const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

const makeData = (data = {}) => (Object.assign({
  firstName: 'Test',
  lastName: 'Patient User',
  email: 'user@test.com',
  password: 'test',
  phoneNumber: '+18887774444',
  accountId,
}, data));

const makePatientData = (data = {}) => (Object.assign({
  accountId,
  firstName: 'Test',
  lastName: 'Patient',
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/PatientUser', () => {
  beforeEach(async () => {
    await wipePatientUserTable();
  });

  afterAll(async () => {
    await wipePatientUserTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a PatientUser without id provided', async () => {
      const data = makeData();
      const pu = await PatientUser.create(data);
      expect(omitProperties(pu.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for bad email format', async () => {
      const data = makeData({ email: 'userTest' });
      try {
        await PatientUser.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('Validation error'));
      }
    });

    test('should NOT throw Unique Field error', async () => {
      // Save one, then try saving another with same data
      await PatientUser.create(makeData());
      const data = makeData({ email: 'other@guy.ca', phoneNumber: '+17807807800' });
      await PatientUser.create(data);
    });

    test('should throw Unique Field error for diff accountId', async () => {
      const data = makeData();
      await PatientUser.create(data);
      try {
        await PatientUser.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeUniqueConstraintError');
        expect(err.message).toEqual(expect.stringContaining('Validation error'));
      }
    });

    test('should throw error for firstName cannot be null', async () => {
      const data = makeData({ firstName: undefined });
      try {
        await PatientUser.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('notNull Violation'));
      }
    });
  });

  describe('Relations', () => {
    beforeEach(async () => {
      await wipeAccountTable();
      await wipePatientTable();
    });

    test('should not fail if you are trying to join a chair if chairId is null', async () =>  {
      await Account.create(makeAccountData());
      const { id } = await PatientUser.create(makeData());
      await Patient.bulkCreate([
        makePatientData({ patientUserId: id }),
        makePatientData({ patientUserId: id }),
      ]);

      const pu = await PatientUser.findOne({
        where: { id },
        include: [
          {
            model: Patient,
            as: 'patients',
          },
        ],
      });

      expect(pu.patients.length).toBe(2);
    });
  });
});
