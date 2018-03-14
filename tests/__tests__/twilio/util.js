/**
 * Created by sharp on 2017-03-22.
 */

import {
  snakeCaseToCamelCase,
  convertKeysToCamelCase,
  sanitizeTwilioSmsData,
} from '../../../server/routes/_twilio/util';

describe('Twilio Util', () => {
  describe('#snakeCaseToCamelCase', () => {
    it('should be a function', () => {
      expect(typeof snakeCaseToCamelCase).toBe('function');
    });

    it('should convert cat_dog_fish to catDogFish', () => {
      expect(snakeCaseToCamelCase('cat_dog_fish')).toBe('catDogFish');
    });
  });

  describe('#convertKeysToCamelCase', () => {
    it('should be a function', () => {
      expect(typeof convertKeysToCamelCase).toBe('function');
    });

    it('should convert PasCal and sn_ake case to caMel case for all keys', () => {
      const data = {
        foo_bar: 1,
        BarFoo: 2,
        camelCase: 3,
      };

      const convertedData = convertKeysToCamelCase(data);
      expect(convertedData).toMatchObject({
        fooBar: 1,
        barFoo: 2,
        camelCase: 3,
      });
    });

    it('should override values', () => {
      // This assumes object respects the key order below
      const data = {
        foo_bar: 1,
        BarFoo: 2,
        FooBar: 2,
        camelCase: 3,
      };

      const convertedData = convertKeysToCamelCase(data);
      expect(convertedData).toMatchObject({
        fooBar: 2,
        barFoo: 2,
        camelCase: 3,
      });
    });
  });

  describe('#sanitizeTwilioSmsData', () => {
    it('should be a function', () => {
      expect(typeof sanitizeTwilioSmsData).toBe('function');
    });

    it('should convert to appropriate twilio webook data to TextMessageData', () => {
      const twilioData = {
        AccountSid: 0,
        MessageSid: 1,
        To: 2,
        From: 3,
        ToZip: 4,
        ToCity: 5,
        FromZip: 8,
        FromCity: 9,
        FromState: 10,
        NumMedia: 0,
        NumSegments: 0,
      };

      expect(sanitizeTwilioSmsData(twilioData)).toMatchObject({
        accountSid: 0,
        messageSid: 1,
        id: 1,
        to: 2,
        from: 3,
        toZip: 4,
        toCity: 5,
        fromZip: 8,
        fromCity: 9,
        fromState: 10,
        numMedia: 0,
        numSegments: 0,
        mediaData: {},
      });
    });
  });
});

