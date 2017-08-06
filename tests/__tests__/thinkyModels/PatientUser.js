
import PatientUser from '../../../server/models/PatientUser';
import wipeModel from '../../util/wipeModel';

const makeData = (data = {}) => (Object.assign({
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  phoneNumber: '+18887774444',
  password: 'cat',
}, data));

describe('models/PatientUser', () => {
  beforeEach(async () => {
    await wipeModel(PatientUser);
  });

  test('should be able to save a PatientUser without id provided', async () => {
    const data = makeData();
    const patientUser = await PatientUser.save(data);
    expect(patientUser).toMatchObject(data);
  });

  describe('Data Sanitization', () => {
    test('should be able to sanitize PatientUser phoneNumber', async () => {
      const data = makeData({ phoneNumber: '111 222 3333' });
      const patientUser = await PatientUser.save(data);

      data.phoneNumber = '+11112223333';
      expect(patientUser).toMatchObject(data);
    });
  });

  describe('Data Validation', () => {
    test('should NOT throw Unique Field error', async () => {
      // Save one, then try saving another with same data
      await PatientUser.save(makeData());

      const data = makeData({ phoneNumber: '+12222222222', email: 'justin@be.ca' });
      const patient = await PatientUser.save(data);
      expect(patient.isSaved()).toBe(true);
    });

    // Cannot do these undefined values for PatientUser
    test.skip('should be able to handle undefined values', async () => {
      const patientUser = await PatientUser.save(makeData({ email: undefined }));
      expect(patientUser.isSaved()).toBe(true);
    });

    test('should throw Unique Field error for 2 docs with same data', async () => {
      // Save one, then try saving another with same data
      await PatientUser.save(makeData());

      // Couldn't get toThrowError working here...
      try {
        await PatientUser.save(makeData());
        throw new Error('Did not pass');
      } catch (err) {
        expect(err.message).toBe('Unique Field Validation Error');
      }
    });

    test('should throw Unique Field error for 3 docs with similar data (1 has same number, 1 has same email)', async () => {
      // Save one, then try saving another with same data
      const email = 'justin@be.ca';
      const phoneNumber = '+18887774444';
      await PatientUser.save(makeData());
      await PatientUser.save(makeData({ phoneNumber: '+12222222222', email }));

      // Couldn't get toThrowError working here...
      try {
        // Same phone number as first, same email as second
        await PatientUser.save(makeData({ phoneNumber, email }));
        throw new Error('Did not pass');
      } catch (err) {
        expect(err.message).toBe('Unique Field Validation Error');
      }
    });
  });
});
