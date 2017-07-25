
import { Account, Patient } from '../../../server/_models';
import { wipeModelSequelize } from '../../util/wipeModel';
import { omitProperties } from '../../util/selectors';

// TODO: should probably make makeData, a reusable function

const accountId = 'ee3c578f-c228-4a25-8388-90ee9a0c9eb4';
const otherAccountId = '00d9d6e9-6941-4dec-8e65-c7bc05977e98';
const makeData = (data = {}) => (Object.assign({
  accountId,
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  mobilePhoneNumber: '+18887774444',
}, data));

// TODO: this will have to change when we add relations to Account & Enterprise

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

const fail = 'Your code should be failing but it is passing';
const uniqueErrorMessage = 'Unique Field Validation Error';

describe('models/Patient', () => {
  // IMPORTANT! Patient needs to be removed first...
  beforeAll(async () => {
    await wipeModelSequelize(Patient);
    await wipeModelSequelize(Account);
  });

  beforeEach(async () => {
    await Account.create(makeAccountData());
  });

  afterEach(async () => {
    await wipeModelSequelize(Patient);
    await wipeModelSequelize(Account);
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

    test('should throw Unique Field error for 2 docs with same data', async () => {
      // Save one, then try saving another with same data
      await Patient.create(makeData());

      // Couldn't get toThrowError working here...
      try {
        await Patient.create(makeData());
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toBe('SequelizeUniqueConstraintError');
      }
    });

    test('should NOT throw Unique Field error for same email but in different accounts', async () => {
      await Account.create(makeAccountData({ id: otherAccountId, name: 'Other Test' }));
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
  });

  describe('Batch Saving', () => {
    test.skip('should be able to save 2 unique patients', async () => {
      const email = 'justin@be.ca';
      const mobilePhoneNumber = '111 222 3333';
      const patients = await Patient.batchSave([
        makeData(),
        makeData({ email, mobilePhoneNumber })
      ]);

      expect(patients.length).toBe(2);
    });

    test.skip('should save one and throw errors for other 2', async () => {
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

    test.skip('save 1 first, then try batch saving, one should fail, one should pass', async () => {
      await Patient.create(makeData());
      try {
        const email = 'justin@be.ca';
        const mobilePhoneNumber = '111 222 3333';
        const p = await Patient.build(makeData());
        const validation = await p.validate({ hooks: true });
        console.log('Passed validation', validation);

        throw new Error(fail);
      } catch (error) {

        console.error(error);

        /*const { errors, docs } = error;
        expect(errors.length).toBe(2);
        expect(docs.length).toBe(0);

        const [error1, error2] = errors;
        expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));*/
      }
    });
  });
});
