
import { cannotSend, generateOrganizedPatients } from '../../../../server/lib/comms/util';

describe('Communications Utility Library', () => {
  describe('cannotSend', () => {
    it('should be a function', () => {
      expect(typeof cannotSend).toBe('function');
    });

    it('should return the correct error for noMobilePhoneNumber (sms)', () => {
      const patient = {};
      const result = cannotSend(patient, 'sms');
      expect(result).toBe(1200);
    });

    it('should return the correct error for noMobilePhoneNumber (phone)', () => {
      const patient = {};
      const result = cannotSend(patient, 'phone');
      expect(result).toBe(1300);
    });

    it('should return the correct error for noEmail', () => {
      const patient = {};
      const result = cannotSend(patient, 'email');
      expect(result).toBe(1100);
    });

    it('should return the no error for sms', () => {
      const patient = { mobilePhoneNumber: '+17801112222' };
      const result = cannotSend(patient, 'sms');
      expect(result).toBeUndefined();
    });

    it('should return the no error for phone', () => {
      const patient = { mobilePhoneNumber: '+17801112222' };
      const result = cannotSend(patient, 'phone');
      expect(result).toBeUndefined();
    });

    it('should return the no error for email', () => {
      const patient = { email: 'a@b.ca' };
      const result = cannotSend(patient, 'email');
      expect(result).toBeUndefined();
    });
  });

  describe('generateOrganizedPatients', () => {
    it('should be a function', () => {
      expect(typeof generateOrganizedPatients).toBe('function');
    });

    it('should return no success and all error', () => {
      const patients = [{}, {}, {}];
      const result = generateOrganizedPatients(patients, 'email');
      expect(result.success.length).toBe(0);
      expect(result.errors.length).toBe(3);
    });

    it('should return no error and all success', () => {
      const patients = [{ email: 'a@b.ca' }, { email: 'a@b.ca' }, { email: 'a@b.ca' }];
      const result = generateOrganizedPatients(patients, 'email');
      expect(result.success.length).toBe(3);
      expect(result.errors.length).toBe(0);
    });

    it('should return 1 success and 2 error', () => {
      const patients = [{ email: 'a@b.ca' }, {}, {}];
      const result = generateOrganizedPatients(patients, 'email');
      expect(result.success.length).toBe(1);
      expect(result.errors.length).toBe(2);
    });
  });
});
