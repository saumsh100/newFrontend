
import axios from 'axios';
import uuid from 'uuid';
import {
  createAccount,
  updateAccount,
  deleteAccount,
  addListings,
  addReputationManagement,
  disableListings,
  disableReputationManagement,
  updateProductIds,
  CREATE_ACCOUNT_URL,
  DELETE_ACCOUNT_URL,
  UPDATE_ACCOUNT_URL,
  GET_ACCOUNT_URL,
  ADD_PRODUCT_URL,
  DISABLE_LISTINGS_URL,
  DISABLE_REPUTATION_MANAGEMENT_URL,
} from './vendasta';
import StatusError from '../../util/StatusError';

jest.mock('axios');
jest.mock('uuid');

const accountId1 = '52954241-3652-4792-bae5-5bfed53d37b8';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const mockId = '52954241-9999-4792-bae5-5bfed53d37c7';

const vendastaSuccessId = 'MA-1234567';
const vendastaExistedId = 'MA-7654321';

const testErrorMessage = 'error message';
const vendastaError = Error(testErrorMessage);
const statusError = StatusError(0, testErrorMessage);

const address = {
  street: 'street',
  city: 'city',
  country: 'country',
  state: 'state',
  zip: 'zip code',
};

const accountWithoutVendastaId = {
  id: accountId1,
  name: 'Test Account 1',
  address,
  update: jest.fn(),
};

const accountWithVendastaId = {
  id: accountId2,
  name: 'Test Account 2',
  vendastaAccountId: vendastaExistedId,
  vendastaSrId: 'SR-ID',
  vendastaMsId: 'MR-ID',
  address,
  update: jest.fn(),
};

describe('Vendasta tests', () => {
  beforeAll(async () => {
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  describe('Vendasta create account tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithoutVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
      uuid.mockReset();
    });

    test('Vendasta create account should update the account model when success', async () => {
      axios.post.mockReturnValue({ data: { data: { accountId: vendastaSuccessId } } });
      uuid.v4.mockReturnValue(mockId);

      await createAccount(accountWithoutVendastaId);
      expect(axios.post).toBeCalledWith(CREATE_ACCOUNT_URL, expect.anything());
      expect(accountWithoutVendastaId.update).toHaveBeenCalledTimes(1);
      expect(accountWithoutVendastaId.update).toBeCalledWith({
        vendastaAccountId: vendastaSuccessId,
        vendastaId: mockId,
      });
    });

    test('Vendasta create account should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(createAccount(accountWithoutVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(CREATE_ACCOUNT_URL, expect.anything());
    });

    test('Vendasta create account should throw error (do nothing) when the account already has associated Vendasta account', async () => {
      await expect(createAccount(accountWithVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta delete account tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta delete account should update the account model when success', async () => {
      axios.post.mockReturnValue({ data: { data: { accountId: vendastaExistedId } } });

      await deleteAccount(accountWithVendastaId);
      expect(axios.post).toBeCalledWith(DELETE_ACCOUNT_URL, expect.anything());
      expect(accountWithVendastaId.update).toHaveBeenCalledTimes(1);
      expect(accountWithVendastaId.update).toBeCalledWith({
        vendastaAccountId: null,
        vendastaId: null,
        vendastaMsId: null,
        vendastaSrId: null,
      });
    });

    test('Vendasta delete account should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(deleteAccount(accountWithVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(DELETE_ACCOUNT_URL, expect.anything());
    });

    test('Vendasta delete account should throw error (do nothing) when the account has no associated Vendasta account', async () => {
      await expect(deleteAccount(accountWithoutVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta update account tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta update account should update the account model when success', async () => {
      axios.post.mockReturnValue({});

      await updateAccount(accountWithVendastaId);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(UPDATE_ACCOUNT_URL, expect.anything());
    });

    test('Vendasta update account should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(updateAccount(accountWithVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(UPDATE_ACCOUNT_URL, expect.anything());
    });

    test('Vendasta update account should throw error (do nothing) when the account has no associated Vendasta account', async () => {
      await expect(updateAccount(accountWithoutVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta add listings tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithoutVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta add listings should call the vendasta API successfully and return the account model', async () => {
      axios.post.mockReturnValue({});

      await addListings(accountWithoutVendastaId);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(ADD_PRODUCT_URL, expect.anything());
    });

    test('Vendasta add listings should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(addListings(accountWithoutVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(ADD_PRODUCT_URL, expect.anything());
    });

    test('Vendasta add listings should throw error (do nothing) when the account already enable listings feature', async () => {
      await expect(addListings(accountWithVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta add reputation management tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
      accountWithoutVendastaId.update.mockClear();
    });

    test('Vendasta add reputation management should call the vendasta API successfully and return the account model', async () => {
      axios.post.mockReturnValue({ data: { data: { productsJson: { RM: { accountId: vendastaExistedId } } } } });

      await addReputationManagement(accountWithoutVendastaId);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(ADD_PRODUCT_URL, expect.anything());
    });

    test('Vendasta add reputation management should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(addReputationManagement(accountWithoutVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(ADD_PRODUCT_URL, expect.anything());
    });

    test('Vendasta add reputation management should throw error (do nothing) when the account already enable reputation management feature', async () => {
      await expect(addReputationManagement(accountWithVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta disable reputation management tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta disable reputation management should update the account model when success', async () => {
      axios.post.mockReturnValue();

      await disableReputationManagement(accountWithVendastaId);
      expect(accountWithVendastaId.update).toHaveBeenCalledTimes(1);
      expect(accountWithVendastaId.update).toBeCalledWith({ vendastaSrId: null });
      expect(axios.post).toBeCalledWith(DISABLE_REPUTATION_MANAGEMENT_URL, expect.anything());
    });

    test('Vendasta disable reputation management should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(disableReputationManagement(accountWithVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(DISABLE_REPUTATION_MANAGEMENT_URL, expect.anything());
    });

    test('Vendasta disable reputation management should throw error (do nothing) when reputation management feature is not enabled', async () => {
      await expect(disableReputationManagement(accountWithoutVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta disable listings tests', () => {
    afterEach(async () => {
      axios.post.mockClear();
      accountWithVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta disable listings should update the account model when success', async () => {
      axios.post.mockReturnValue();

      await disableListings(accountWithVendastaId);
      expect(accountWithVendastaId.update).toHaveBeenCalledTimes(1);
      expect(accountWithVendastaId.update).toBeCalledWith({ vendastaMsId: null });
      expect(axios.post).toBeCalledWith(DISABLE_LISTINGS_URL, expect.anything());
    });

    test('Vendasta disable listings should throw error when Vendasta API failed and not change the account model', async () => {
      axios.post.mockImplementation(() => Promise.reject(vendastaError));

      await expect(disableListings(accountWithVendastaId)).rejects.toEqual(statusError);
      expect(axios.post).toBeCalledWith(DISABLE_LISTINGS_URL, expect.anything());
    });

    test('Vendasta disable listings should throw error (do nothing) when listings feature is not enabled', async () => {
      await expect(disableListings(accountWithoutVendastaId)).rejects.toThrow(StatusError);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  describe('Vendasta update product ids tests', () => {
    afterEach(async () => {
      axios.get.mockClear();
      accountWithVendastaId.update.mockClear();
    });

    afterAll(async () => {
      axios.mockReset();
    });

    test('Vendasta update product ids should update the account model when success', async () => {
      axios.get.mockReturnValue({
        data: {
          data: {
            productsJson: {
              MS: { productId: vendastaSuccessId },
              RM: { productId: vendastaSuccessId },
            },
          },
        },
      });

      await updateProductIds(accountWithVendastaId);
      expect(accountWithVendastaId.update).toHaveBeenCalledTimes(1);
      expect(accountWithVendastaId.update).toBeCalledWith({
        vendastaMsId: vendastaSuccessId,
        vendastaSrId: vendastaSuccessId,
      });
      expect(axios.get).toBeCalledWith(`${GET_ACCOUNT_URL}&accountId=${vendastaExistedId}`);
    });

    test('Vendasta update product ids should throw error when Vendasta API failed', async () => {
      axios.get.mockImplementation(() => Promise.reject(vendastaError));

      await expect(updateProductIds(accountWithVendastaId)).rejects.toEqual(statusError);
      expect(axios.get).toBeCalledWith(`${GET_ACCOUNT_URL}&accountId=${vendastaExistedId}`);
    });

    test('Vendasta update product ids should throw error when no vendasta id found for the account', async () => {
      await expect(updateProductIds(accountWithoutVendastaId)).rejects.toThrow(StatusError);
      expect(axios.get).toHaveBeenCalledTimes(0);
    });
  });
});
