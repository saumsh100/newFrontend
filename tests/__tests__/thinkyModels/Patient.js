
import { v4 as uuid } from 'uuid';
import { omit } from 'lodash';
import Patient from '../../../server/models/Patient';
import thinky from '../../../server/config/thinky';
import wipeModel from '../../util/wipeModel';

const accountId1 = uuid();
const accountId2 = uuid();
const uniqueErrorMessage = 'Unique Field Validation Error';

const makeData = (data = {}) => (Object.assign({
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  mobilePhoneNumber: '+18887774444',
  accountId: accountId1,
}, data));

describe('models/Patient', () => {
  beforeEach(async () => {
    await wipeModel(Patient);
  });

  afterEach(async () => {
    await wipeModel(Patient);
  });

  test('should be able to save a Patient without id provided', async () => {
    const data = makeData();
    const patient = await Patient.save(data);
    expect(patient).toMatchObject(data);
  });

  describe('Data Sanitization', () => {
    test('should be able to sanitize Patient mobilePhoneNumber', async () => {
      const data = makeData({ mobilePhoneNumber: '111 222 3333' });
      const patient = await Patient.save(data);

      data.mobilePhoneNumber = '+11112223333';
      expect(patient).toMatchObject(data);
    });
  });

  describe('Data Validation', () => {
    test('should NOT throw Unique Field error', async () => {
      // Save one, then try saving another with same data
      await Patient.save(makeData());
      const data = makeData({ mobilePhoneNumber: '+12222222222', email: 'justin@be.ca' });
      const patient = await Patient.save(data);
      expect(patient.isSaved()).toBe(true);
    });

    test('should NOT throw Unique Field error for diff accountId', async () => {
      // Save one, then try saving another with same data
      await Patient.save(makeData());
      const data = makeData({ accountId: accountId2 });
      const patient = await Patient.save(data);
      expect(patient.isSaved()).toBe(true);
    });

    test('should be able to handle undefined values', async () => {
      const patient = await Patient.save(makeData({ email: undefined }));
      expect(patient.isSaved()).toBe(true);
    });

    test('should throw Unique Field error for 2 docs with same data', async () => {
      // Save one, then try saving another with same data
      await Patient.save(makeData());

      // Couldn't get toThrowError working here...
      try {
        await Patient.save(makeData());
        throw new Error('Did not pass');
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining(uniqueErrorMessage));
      }
    });

    test('should throw Unique Field error for 3 docs with similar data (1 has same number, 1 has same email)', async () => {
      // Save one, then try saving another with same data
      const email = 'justin@be.ca';
      const mobilePhoneNumber = '+18887774444';
      await Patient.save(makeData());
      await Patient.save(makeData({ mobilePhoneNumber: '+12222222222', email }));

      // Couldn't get toThrowError working here...
      try {
        // Same phone number as first, same email as second
        await Patient.save(makeData({ mobilePhoneNumber, email }));
        throw new Error('Did not pass');
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining(uniqueErrorMessage));
      }
    });

    test('should throw Unique Field error for 4 docs with similar data (1 has same number, 1 has same email)', async () => {
      // Save one, then try saving another with same data
      const email = 'justin@be.ca';
      const mobilePhoneNumber = '+12226665555';
      await Patient.save(makeData());
      await Patient.save(makeData({ accountId: accountId2, email }));
      await Patient.save(makeData({ mobilePhoneNumber, email }));

      // Couldn't get toThrowError working here...
      try {
        // Same phone number as first, same email as second
        await Patient.save(makeData({ email }));
        throw new Error('Did not pass');
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining(uniqueErrorMessage));
      }
    });

    test('should NOT throw for undefined values', async () => {
      // Save one, then try saving another with same data
      await Patient.save(makeData({ email: undefined, mobilePhoneNumber: undefined }));
      const p = await Patient.save(makeData({ email: undefined, mobilePhoneNumber: undefined }));
      expect(p.isSaved()).toBe(true);
    });

    test('should NOT throw for null values', async () => {
      // Save one, then try saving another with same data
      await Patient.save(makeData({ email: null, mobilePhoneNumber: null }));
      const p = await Patient.save(makeData({ email: null, mobilePhoneNumber: null }));
      expect(p.isSaved()).toBe(true);
    });

    describe('on(\'update\')', () => {
      test('should throw an error for updating to a taken unique field', async () => {
        const email = 'justin@be.ca';
        const mobilePhoneNumber = '+12226665555';
        await Patient.save(makeData());
        const patient = await Patient.save(makeData({ email, mobilePhoneNumber }));
        try {
          await patient.merge({
            email: 'justin@carecru.com',
            mobilePhoneNumber: '+18887774444',
          }).save();

          throw new Error('Did not pass');
        } catch (err) {
          expect(err.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        }
      });
    });
  });

  describe('Batch Saving', () => {
    describe('#preUniqueValidator', () => {
      test('it should throw 1 error and return 1 patient model', async () => {
        const id = uuid();
        const data = [
          makeData(),
          makeData({ id }),
        ];

        const { docs, errors } = await Patient.preValidateArray(data);

        expect(errors.length).toBe(1);
        expect(docs.length).toBe(1);

        const [doc] = docs;
        const [error] = errors;

        // Ensure it is a Patient model...
        expect(doc.isSaved()).toBe(false);

        // Defaults got added
        expect(typeof doc.preferences).toBe('object');

        // Error should have correct message and correct doc
        expect(error.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error.doc).toMatchObject(makeData({ id }));

      });

      test('it should throw 2 errors and return 1 patient model', async () => {
        const id1 = uuid();
        const id2 = uuid();
        const data = [
          makeData(),
          makeData({ id: id1 }),
          makeData({ id: id2 }),
        ];

        const { docs, errors } = await Patient.preValidateArray(data);

        expect(errors.length).toBe(2);
        expect(docs.length).toBe(1);

        const [doc] = docs;
        const [error1, error2] = errors;

        expect(doc.isSaved()).toBe(false);
        expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error1.doc).toMatchObject(makeData({ id: id1 }));
        expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error2.doc).toMatchObject(makeData({ id: id2 }));
      });
    });

    test('should be able to save 2 unique patients', async () => {
      const email = 'justin@be.ca';
      const mobilePhoneNumber = '111 222 3333';
      const patients = await Patient.batchSave([
        makeData(),
        makeData({ email, mobilePhoneNumber })
      ]);

      expect(patients.length).toBe(2);
    });

    test('should save one and throw an error for the other', async () => {
      try {
        await Patient.batchSave([
          makeData(),
          makeData()
        ]);

        throw new Error('Did not pass');
      } catch ({ errors, docs }) {
        expect(errors.length).toBe(1);
        expect(docs.length).toBe(1);

        const [error] = errors;
        const [patient] = docs;
        expect(error.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(patient.isSaved()).toBe(true);
      }
    });

    test('should save one and throw an error for the other 2', async () => {
      try {
        await Patient.batchSave([
          makeData(),
          makeData(),
          makeData(),
        ]);

        throw new Error('Did not pass');
      } catch ({ errors, docs }) {
        expect(errors.length).toBe(2);
        expect(docs.length).toBe(1);

        const [error1, error2] = errors;
        const [patient] = docs;
        expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(patient.isSaved()).toBe(true);
      }
    });

    test('save 1 first, then try batch saving, both should fail', async () => {
      try {
        await Patient.save(makeData());

        await Patient.batchSave([
          makeData(),
          makeData(),
        ]);

        throw new Error('Did not pass');
      } catch ({ errors, docs }) {

        expect(errors.length).toBe(2);
        expect(docs.length).toBe(0);

        const [error1, error2] = errors;
        expect(error1.message).toEqual(expect.stringContaining(uniqueErrorMessage));
        expect(error2.message).toEqual(expect.stringContaining(uniqueErrorMessage));
      }
    });
  });
});
