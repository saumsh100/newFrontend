
import convertToCommsPreferences from '../../../server/util/convertToCommsPreferences';

describe('util/convertToCommsPreferences', () => {
  describe('#convertToCommsPreferences', () => {
    test('should be a function', () => {
      expect(typeof convertToCommsPreferences).toBe('function');
    });

    test('should return only sms', () => {
      expect(convertToCommsPreferences(`
        SMS ONLY
      `)).toEqual({
        sms: true,
        emailNotifications: false,
        phone: false,
      });
    });

    test('should return only phone', () => {
      expect(convertToCommsPreferences(`
        ONLY do calls
      `)).toEqual({
        sms: false,
        emailNotifications: false,
        phone: true,
      });
    });

    test('should return only phone', () => {
      expect(convertToCommsPreferences(`
        do not sms or email
      `)).toEqual({
        sms: false,
        emailNotifications: false,
        phone: true,
      });
    });

    test('should return phone and email', () => {
      expect(convertToCommsPreferences(`
        don't SMS
      `)).toEqual({
        sms: false,
        emailNotifications: true,
        phone: true,
      });
    });

    test('should return only email', () => {
      expect(convertToCommsPreferences(`
        no sms or calls
      `)).toEqual({
        sms: false,
        emailNotifications: true,
        phone: false,
      });
    });

    test('should return only email', () => {
      expect(convertToCommsPreferences(`
        no sms or calls. only email
      `)).toEqual({
        sms: false,
        emailNotifications: true,
        phone: false,
      });
    });

    test('should return only phone', () => {
      expect(convertToCommsPreferences(`
        no sms/emails
      `)).toEqual({
        sms: false,
        emailNotifications: false,
        phone: true,
      });
    });
  });
});

