/**
 * Created by sergey on 2017-05-30.
 */
const {
  validatePhoneNumber,
} = require('../../server/util/validators');

describe('util/validators', () => {
  describe('#validatePhoneNumberValid', () => {
    it('should be a function', () => {
      expect(typeof validatePhoneNumber).toBe('function');
    });

    it('valid - should be valid', () => {
      const validNumber = '7782422626';
      expect(validatePhoneNumber(validNumber)).toBe('+1'.concat(validNumber));
    });

    it('invalid - should be invalid', () => {
      const number = '77824aa626';
      expect(validatePhoneNumber(number)).toBe(null);
    });

    it('empty - should be invalid', () => {
      const invalidNumber = '';
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });

    it('undefined - should be invalid', () => {
      const invalidNumber = undefined;
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });

    it('null - should be invalid', () => {
      const invalidNumber = null;
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });

    it('too long - should be invalid', () => {
      const invalidNumber = '+107782422626';
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });
  });
});

