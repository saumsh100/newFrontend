
import twilioClient from '../../config/twilio';
import { twilioSetup, twilioDelete } from './twilio';
import StatusError from '../../util/StatusError';

jest.mock('../../config/twilio');

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
    beforeAll(async () => {
      twilioClient.availablePhoneNumbers.mockReturnValue({
        local: {
          list: ({ InPostalCode, areaCode }) =>
            new Promise((resolve) => {
              if (InPostalCode || areaCode) {
                resolve({ availablePhoneNumbers: [] });
              }
              resolve({ availablePhoneNumbers: [{ phone_number: '+17799999999' }] });
            }),
        },
      });
    });

    afterEach(async () => {
      twilioClient.availablePhoneNumbers.mockClear();
    });

    afterAll(async () => {
      twilioClient.mockReset();
    });

    test('twilioSetup should throw error when account does not have country/state set', async () => {
      await expect(twilioSetup(account1)).rejects.toEqual(StatusError(400, 'address.state is not set'));
    });

    test('twilioSetup should throw error when account does not have destination phone number', async () => {
      await expect(twilioSetup(account2)).rejects.toEqual(StatusError(400, 'destinationPhoneNumber is not set'));
    });

    test('twilioSetup should throw error when account already has a twilio phone number', async () => {
      await expect(twilioSetup(account3)).rejects.toEqual(StatusError(400, 'This account already has twilioPhoneNumber'));
    });

    test('twilioSetup should return the updated account', async () => {
      await twilioSetup(account4);
      expect(twilioClient.availablePhoneNumbers).toHaveBeenCalledTimes(3);
      expect(twilioClient.incomingPhoneNumbers.create).toHaveBeenCalledTimes(1);
      expect(account4.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('twilioDelete test', () => {
    beforeAll(async () => {
      twilioClient.incomingPhoneNumbers.list.mockReturnValue({ incomingPhoneNumbers: [{ phone_number: '+17799999999' }] });
      twilioClient.incomingPhoneNumbers.mockReturnValue({ delete: jest.fn() });
    });

    afterEach(async () => {
      twilioClient.incomingPhoneNumbers.list.mockClear();
      twilioClient.incomingPhoneNumbers.mockClear();
    });

    afterAll(async () => {
      twilioClient.mockReset();
    });

    test('twilioDelete should throw error when account does not have twilio phone number', async () => {
      await expect(twilioDelete(account2)).rejects.toEqual(StatusError(400, 'twilioPhoneNumber is not set'));
    });
    test('twilioDelete should throw error when the twilio number in account does not exist in twilio account', async () => {
      await expect(twilioDelete(account3)).rejects.toEqual(StatusError(400, 'Twilio Number Not Found'));
    });
    test('twilioDelete should return the updated account', async () => {
      account3.twilioPhoneNumber = '+17799999999';
      await twilioDelete(account3);
      expect(twilioClient.incomingPhoneNumbers.list).toHaveBeenCalledTimes(1);
      expect(twilioClient.incomingPhoneNumbers).toHaveBeenCalledTimes(1);
      expect(account3.update).toHaveBeenCalledTimes(1);
    });
  });
});
