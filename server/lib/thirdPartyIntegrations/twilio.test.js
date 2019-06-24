
import * as twilio from './twilio';
import StatusError from '../../util/StatusError';

const accountId = '52954241-3652-4792-bae5-5bfed53d37b8';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const accountId3 = '52954241-3652-4792-bae5-5bfed53d37b6';

const account1 = {
  id: accountId2,
  address: {},
  name: 'Test Account 2',
};

const account2 = {
  id: accountId2,
  address: {
    country: 'CA',
    state: 'BC',
  },
  name: 'Test Account 2',
};

const account3 = {
  id: accountId,
  address: {
    country: 'CA',
    state: 'BC',
  },
  twilioPhoneNumber: '+16043333333',
  destinationPhoneNumber: '+16043333333',
  name: 'Test Account 1',
  update: jest.fn(),
};

const account4 = {
  id: accountId3,
  address: {
    country: 'CA',
    state: 'BC',
    zipCode: 'V6T 1W9',
  },
  name: 'Test Account 3',
  destinationPhoneNumber: '+16041234567',
  twilioPhoneNumber: null,
  update: jest.fn(),
};

describe('twilio test', () => {
  describe('twilioSetup test', () => {
    test('twilioSetup should throw error when account does not have country/state set', async () => {
      await expect(twilio.twilioSetup(account1)).rejects.toEqual(StatusError(400, 'address.state is not set'));
    });

    test('twilioSetup should throw error when account does not have destination phone number', async () => {
      await expect(twilio.twilioSetup(account2)).rejects.toEqual(StatusError(400, 'destinationPhoneNumber is not set'));
    });

    test('twilioSetup should throw error when account already has a twilio phone number', async () => {
      await expect(twilio.twilioSetup(account3)).rejects.toEqual(StatusError(400, 'This account already has twilioPhoneNumber'));
    });

    test.skip('twilioSetup should throw error when the number is not valid', async () => {
      jest.spyOn(twilio, 'getAvailableNumber');
      twilio.getAvailableNumber.mockReturnValue('+15005550001');
      await expect(twilio.twilioSetup(account4)).rejects.toEqual(StatusError(400, '+15005550001 is not a valid number'));
    });

    test.skip('twilioSetup should throw error when the number is unavailable', async () => {
      jest.spyOn(twilio, 'getAvailableNumber');
      twilio.getAvailableNumber.mockReturnValue('+15005550000');
      await expect(twilio.twilioSetup(account4)).rejects.toEqual(StatusError(400, '+15005550000 is not available'));
    });

    test.skip('twilioSetup should return the updated account', async () => {
      jest.spyOn(twilio, 'getAvailableNumber');
      twilio.getAvailableNumber.mockReturnValue('+15005550006');
      await twilio.twilioSetup(account4);
      expect(account4.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('twilioDelete test', () => {
    test('twilioDelete should throw error when account does not have twilio phone number', async () => {
      await expect(twilio.twilioDelete(account2)).rejects.toEqual(StatusError(400, 'twilioPhoneNumber is not set'));
    });
  });
});
