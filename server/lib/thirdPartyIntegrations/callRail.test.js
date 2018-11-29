import axios from 'axios';
import * as CallRail from './callRail';
import StatusError from '../../util/StatusError';
import { account } from '../../../tests/util/seedTestUsers';

const oldPhoneNumber = '+123456';
const newPhoneNumber = '+654321';
const callrailId = 123456;
const accountWithCallRailId = {
  ...account,
  callrailId,
  update: jest.fn(),
};
const accountWithOutCallrailId = {
  ...account,
  update: jest.fn(),
};
const testErrorMessage = 'error message';
const callRailError = {
  ...Error,
  statusText: testErrorMessage,
};
const statusError = StatusError(0, testErrorMessage);

jest.mock('axios');

describe('CallRail tests', () => {
  beforeAll(async () => {
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  describe('CallRail update phone number tests', () => {
    beforeAll(async () => {
      jest.spyOn(CallRail, 'getCallRailInformation');
      CallRail.getCallRailInformation.mockImplementation(() => {
        return true;
      });
    });
    afterEach(async () => { 
      axios.mockClear();
      CallRail.getCallRailInformation.mockClear();
    });
    afterAll(async () => {
      axios.mockReset();
      CallRail.getCallRailInformation.mockRestore();
    });

    test('CallRail update phone number should throw error when the account does not have callRail account associate with', async () => {
      await expect(CallRail.updatePhoneNumber(accountWithOutCallrailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail update phone number should throw error when phone number is not provided', async () => {
      await expect(CallRail.updatePhoneNumber(accountWithCallRailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail update phone number should do nothing when the no phone number matches the old phone number', async () => {
      axios.mockReturnValueOnce({ data: { trackers: [{ status: 'active', destination_number: oldPhoneNumber }] } });
      await CallRail.updatePhoneNumber(accountWithCallRailId, newPhoneNumber, newPhoneNumber);
      expect(axios).toHaveBeenCalledTimes(1);
    });

    test('CallRail update phone number should do nothing when the no phone number matches the old phone number', async () => {
      axios.mockReturnValueOnce({ data: { trackers: [{ status: 'active', destination_number: oldPhoneNumber }] } })
      await CallRail.updatePhoneNumber(accountWithCallRailId, oldPhoneNumber, newPhoneNumber);
      expect(axios).toHaveBeenCalledTimes(2);
    });
  });

  describe('CallRail update company name tests', () => {
    afterEach(async () => {
      axios.mockClear();
    });
    afterAll(async () => axios.mockReset());

    test('CallRail update company name should throw error when the account does not have callRail account associate with', async () => {
      await expect(CallRail.updateCompanyName(accountWithOutCallrailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail update company name should throw error when the CallRail API failed', async () => {
      axios.mockImplementation(() => Promise.reject(callRailError));
      await expect(CallRail.updateCompanyName(accountWithCallRailId)).rejects.toEqual(statusError);
    });

    test('CallRail update company name should call the CallRail API and success', async () => {
      axios.mockReturnValue({});
      await CallRail.updateCompanyName(accountWithCallRailId);
      expect(axios).toHaveBeenCalledTimes(1);
    });
  });

  describe('CallRail get account tests', () => {
    afterEach(async () => {
      axios.mockClear();
    });
    afterAll(async () => axios.mockReset());

    test('CallRail get account should throw error when the account does not have callRail account associate with', async () => {
      await expect(CallRail.getCallRailInformation(accountWithOutCallrailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail get account should throw error when the CallRail API failed', async () => {
      axios.mockImplementation(() => Promise.reject(callRailError));
      await expect(CallRail.getCallRailInformation(accountWithCallRailId)).rejects.toEqual(statusError);
    });

    test('CallRail get account should throw error when the account is disabled', async () => {
      axios.mockReturnValue({ data: { status: 'disabled' } });
      await expect(CallRail.getCallRailInformation(accountWithCallRailId)).rejects.toThrow(StatusError);
    });

    test('CallRail get account should get account information with only active information when success', async () => {
      axios.mockReturnValueOnce({ data: { status: 'active' } })
        .mockReturnValueOnce({ data: { trackers: [{ status: 'active' }, { status: 'disabled' }] } })
        .mockReturnValueOnce({ data: { integrations: [] } });
      await expect(CallRail.getCallRailInformation(accountWithCallRailId)).toMatchSnapshot();
    });
  });

  describe('CallRail delete account tests', () => {
    afterEach(async () => {
      axios.mockClear();
      accountWithCallRailId.update.mockReset();
    });
    afterAll(async () => axios.mockReset());

    test('CallRail delete account should throw error when the account does not have callRail account associate with', async () => {
      await expect(CallRail.disableCallRailAccount(accountWithOutCallrailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail delete account should throw error when CallRail API failed and not change the account model', async () => {
      axios.mockImplementation(() => Promise.reject(callRailError));
      await expect(CallRail.disableCallRailAccount(accountWithCallRailId)).rejects.toEqual(statusError);
    });

    test('CallRail delete account should update the account model when success', async () => {
      axios.mockReturnValue({});
      await CallRail.disableCallRailAccount(accountWithCallRailId);
      expect(axios).toHaveBeenCalledTimes(1);
      expect(accountWithCallRailId.update).toHaveBeenCalledTimes(1);
      expect(accountWithCallRailId.update).toBeCalledWith({ callrailId: null });
    });
  });

  describe('CallRail create account tests', () => {
    afterEach(async () => {
      axios.mockClear();
      accountWithOutCallrailId.update.mockReset();
    });
    afterAll(async () => axios.mockReset());

    test('CallRail creates account should throw error when the account already has callRail account associate with', async () => {
      await expect(CallRail.createCallRailAccount(accountWithCallRailId)).rejects.toThrow(StatusError);
      expect(axios).toHaveBeenCalledTimes(0);
    });

    test('CallRail creates account should throw error when CallRail API failed and not change the account model', async () => {
      axios.mockImplementation(() => Promise.reject(callRailError));
      await expect(CallRail.createCallRailAccount(accountWithOutCallrailId)).rejects.toEqual(statusError);
    });

    test('CallRail creates account should update the account model when success', async () => {
      axios.mockReturnValue({ data: { id: callrailId } });
      await CallRail.createCallRailAccount(accountWithOutCallrailId);
      expect(axios).toHaveBeenCalledTimes(3);
      expect(accountWithOutCallrailId.update).toHaveBeenCalledTimes(1);
      expect(accountWithOutCallrailId.update).toBeCalledWith({ callrailId });
    });
  });
});
