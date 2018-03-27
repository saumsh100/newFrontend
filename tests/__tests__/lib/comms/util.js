
import omit from 'lodash/omit';
import {
  cannotSend,
  generateOrganizedPatients,
  organizeForOutbox,
} from '../../../../server/lib/comms/util';

const preferences = { sms: true, emailNotifications: true, phone: true };

describe('Communications Utility Library', () => {
  describe('cannotSend', () => {
    it('should be a function', () => {
      expect(typeof cannotSend).toBe('function');
    });

    it('should return the correct error for noMobilePhoneNumber (sms)', () => {
      const patient = { preferences };
      const result = cannotSend(patient, 'sms');
      expect(result).toBe('1200');
    });

    it('should return the correct error for noMobilePhoneNumber (phone)', () => {
      const patient = { preferences };
      const result = cannotSend(patient, 'phone');
      expect(result).toBe('1300');
    });

    it('should return the correct error for noEmail', () => {
      const patient = { preferences };
      const result = cannotSend(patient, 'email');
      expect(result).toBe('1100');
    });

    it('should return the no error for sms', () => {
      const patient = { mobilePhoneNumber: '+17801112222', preferences };
      const result = cannotSend(patient, 'sms');
      expect(result).toBeUndefined();
    });

    it('should return the no error for phone', () => {
      const patient = { mobilePhoneNumber: '+17801112222', preferences };
      const result = cannotSend(patient, 'phone');
      expect(result).toBeUndefined();
    });

    it('should return the no error for email', () => {
      const patient = { email: 'a@b.ca', preferences };
      const result = cannotSend(patient, 'email');
      expect(result).toBeUndefined();
    });
  });

  describe('generateOrganizedPatients', () => {
    it('should be a function', () => {
      expect(typeof generateOrganizedPatients).toBe('function');
    });

    it('should return no success and all error', () => {
      const patients = [{ preferences }, { preferences }, { preferences }];
      const result = generateOrganizedPatients(patients, ['email']);
      expect(result.success.length).toBe(0);
      expect(result.errors.length).toBe(3);
    });

    it('should return no error and all success', () => {
      const patients = [{ email: 'a@b.ca', preferences }, { email: 'a@b.ca', preferences }, { email: 'a@b.ca', preferences }];
      const result = generateOrganizedPatients(patients, ['email']);
      expect(result.success.length).toBe(3);
      expect(result.errors.length).toBe(0);
    });

    it('should return 1 success and 2 error', () => {
      const patients = [{ email: 'a@b.ca', preferences }, { preferences }, { preferences }];
      const result = generateOrganizedPatients(patients, ['email']);
      expect(result.success.length).toBe(1);
      expect(result.errors.length).toBe(2);
    });

    it('should return 1 success and 2 error', () => {
      const patients = [
        { id: 0, email: 'a@b.ca', preferences },
        { id: 1, email: 'b@a.ca', preferences },
        { id: 2, mobilePhoneNumber: '+17808508886', preferences },
      ];

      const result = generateOrganizedPatients(patients, ['email', 'sms']);
      expect(result.success.length).toBe(3);
      expect(result.errors.length).toBe(3);

      expect(result.success[0].primaryType).toBe('email');
      expect(result.success[1].primaryType).toBe('email');
      expect(result.success[2].primaryType).toBe('sms');

      expect(result.errors[0].primaryType).toBe('sms');
      expect(result.errors[1].primaryType).toBe('sms');
      expect(result.errors[2].primaryType).toBe('email');
    });
  });

  describe('organizeForOutbox', () => {
    test('should be a function', () => {
      expect(typeof organizeForOutbox).toBe('function');
    });

    test('should return proper array', () => {
      const array = [
        {
          appointment: { id: 1 },
          patient: { id: 2, preferences },
          primaryType: 'email'
        },
        {
          appointment: { id: 1 },
          patient: { id: 2, preferences },
          primaryType: 'sms'
        },
        {
          appointment: { id: 2 },
          patient: { id: 1, preferences },
          primaryType: 'sms'
        },
      ];

      const selectorPredicate = ({ appointment }) => appointment.id;
      const mergePredicate = (groupedArray) => {
        const primaryTypes = groupedArray.map(item => item.primaryType);
        const newObj = {
          ...groupedArray[0],
          primaryTypes,
        };

        return omit(newObj, 'primaryType');
      };

      const organizedArray = organizeForOutbox(array, selectorPredicate, mergePredicate);

      expect(organizedArray.length).toBe(2);
      expect(organizedArray[0].primaryTypes).toEqual(['email', 'sms']);
      expect(organizedArray[1].primaryTypes).toEqual(['sms']);
    });
  });
});
