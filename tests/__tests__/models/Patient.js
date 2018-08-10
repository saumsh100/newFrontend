
import { Account, Patient } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { seedTestUsers, accountId, enterpriseId, addressId } from '../../util/seedTestUsers';
import { omitProperties } from '../../util/selectors';

const otherAccountId = '00d9d6e9-6941-4dec-8e65-c7bc05977e98';
const makeData = (data = {}) => (Object.assign({
  accountId,
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  mobilePhoneNumber: '+18887774444',
}, data));

const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

const fail = 'Your code should be failing but it is passing';
const uniqueErrorMessage = 'Unique Field Validation Error';

describe('models/Patient', () => {
  beforeEach(async () => {
    await wipeModel(Patient);
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Data Validation', () => {
    test('should be able to save a Patient without id provided', async () => {
      const data = makeData();
      const patient = await Patient.create(data);
      expect(omitProperties(patient.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should be able to sanitize Patient mobilePhoneNumber', async () => {
      const data = makeData({ mobilePhoneNumber: '111 222 3333' });
      const patient = await Patient.create(data);
      expect(patient.mobilePhoneNumber).toBe('+11112223333');
    });

    test('should set Patient mobilePhoneNumber to null if not valid string', async () => {
      const data = makeData({ mobilePhoneNumber: '11 222 3333' });
      const patient = await Patient.create(data);
      expect(patient.mobilePhoneNumber).toBe(null);
    });

    test('should not throw any Unique Field error for 2 docs with same mobilePhoneNumber', async () => {
      // Save one, then try saving another with same data
      const p1 = await Patient.create(makeData());
      const p2 = await Patient.create(makeData());
      expect(p1.mobilePhoneNumber).toBe(p2.mobilePhoneNumber);
    });

    test('should not throw Unique Field error for same email but in different accounts', async () => {
      await Account.create(makeAccountData({ id: otherAccountId, name: 'Other Test', enterpriseId, addressId }));
      const p1 = await Patient.create(makeData());
      const p2 = await Patient.create(makeData({ accountId: otherAccountId }));

      expect(p1.mobilePhoneNumber).toEqual(p2.mobilePhoneNumber);
      expect(p1.email).toEqual(p2.email);
    });

    test('should NOT throw for undefined values', async () => {
      // Save one, then try saving another with same data
      await Patient.create(makeData({ email: undefined, mobilePhoneNumber: undefined }));
      await Patient.create(makeData({ email: undefined, mobilePhoneNumber: undefined }));
    });

    test('should NOT throw for null values', async () => {
      // Save one, then try saving another with same data
      await Patient.create(makeData({ email: null, mobilePhoneNumber: null }));
      await Patient.create(makeData({ email: null, mobilePhoneNumber: null }));
    });

    test('should throw an error for improper email', async () => {
      const data = makeData({ email: ' cat@dog ' });
      try {
        await Patient.create(data);
        throw new Error(fail);
      } catch (error) {
        expect(error.name).toBe('SequelizeValidationError');
      }
    });
  });

  describe.skip('DEPRECATED: Batch Saving', () => {
    describe('#uniqueValidate', () => {
      test('should fail', async () => {
        await Patient.create(makeData());
        try {
          await Patient.uniqueValidate(makeData());
          throw new Error(fail);
        } catch (error) {
          expect(error.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        }
      });

      test('should not fail', async () => {
        const email = 'justin@be.ca';
        // has to be in the post validation format
        const mobilePhoneNumber = '+11112223333';
        await Patient.create(makeData());
        await Patient.uniqueValidate(makeData({ email, mobilePhoneNumber }));
      });
    });

    describe('#batchSave', () => {
      test('should be able to save 2 unique patients', async () => {
        const email = 'justin@be.ca';
        const mobilePhoneNumber = '111 222 3333';
        const patients = await Patient.batchSave([
          makeData(),
          makeData({ email, mobilePhoneNumber }),
        ]);

        expect(patients.length).toBe(2);
      });

      test('should save one and throw errors for other 2', async () => {
        try {
          await Patient.batchSave([
            makeData(),
            makeData(),
            makeData(),
          ]);

          throw new Error(fail);
        } catch ({ docs, errors }) {
          expect(errors.length).toBe(2);
          expect(docs.length).toBe(1);

          const [error1, error2] = errors;
          expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
          expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        }
      });

      test('save 1 first, then try batch saving, both should fail', async () => {
        await Patient.create(makeData());
        try {
          await Patient.batchSave([
            makeData(),
            makeData(),
          ]);

          throw new Error(fail);
        } catch (error) {
          const { errors, docs } = error;
          expect(errors.length).toBe(2);
          expect(docs.length).toBe(0);

          const [error1, error2] = errors;
          expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
          expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        }
      });
    });
  });
});
