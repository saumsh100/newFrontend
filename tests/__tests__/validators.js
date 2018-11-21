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
      expect(validatePhoneNumber(validNumber)).toBe(`+1${validNumber}`);
    });

    it('invalid - should be invalid', () => {
      const number = '77824aa626';
      expect(() => validatePhoneNumber(number)).toThrowError('Invalid phoneNumber format for "77824aa626", use: +1 222 333 4444');
    });

    it('empty - should be invalid', () => {
      const invalidNumber = '';
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });

    it('undefined - should be invalid', () => {
      const invalidNumber = undefined;
      expect(() => validatePhoneNumber(invalidNumber)).toThrowError('Invalid phoneNumber format for "undefined", use: +1 222 333 4444');
    });

    it('null - should be invalid', () => {
      const invalidNumber = null;
      expect(validatePhoneNumber(invalidNumber)).toBe(null);
    });

    it('long - should be invalid', () => {
      const invalidNumber = '+1 0778242 2626';
      expect(() => validatePhoneNumber(invalidNumber)).toThrowError('Invalid phoneNumber format for "+1 0778242 2626", use: +1 222 333 4444');
    });
    it('too long - should be invalid', () => {
      const invalidNumber = '117748242266';
      expect(() => validatePhoneNumber(invalidNumber)).toThrowError('Invalid phoneNumber format for "117748242266", use: +1 222 333 4444');
    });
  });
});

