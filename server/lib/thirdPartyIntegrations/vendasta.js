
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import queryString from 'query-string';
import { vendasta } from '../../config/globals';
import StatusError from '../../util/StatusError';

const apiAuth = `?${queryString.stringify(vendasta)}`;

export const VENDASTA_ACCOUNT_URL = 'https://api.vendasta.com/api/v3/account';
export const CREATE_ACCOUNT_URL = `${VENDASTA_ACCOUNT_URL}/create/${apiAuth}`;
export const UPDATE_ACCOUNT_URL = `${VENDASTA_ACCOUNT_URL}/update/${apiAuth}`;
export const DELETE_ACCOUNT_URL = `${VENDASTA_ACCOUNT_URL}/delete/${apiAuth}`;
export const GET_ACCOUNT_URL = `${VENDASTA_ACCOUNT_URL}/get/${apiAuth}`;
export const ADD_PRODUCT_URL = `${VENDASTA_ACCOUNT_URL}/addProduct/${apiAuth}`;
export const DISABLE_LISTINGS_URL = `https://presence-builder-api.vendasta.com/api/v3/site/delete/${apiAuth}`;
export const DISABLE_REPUTATION_MANAGEMENT_URL = `https://reputation-intelligence-api.vendasta.com/api/v2/account/delete/${apiAuth}`;

const errorHandling = (e) => {
  throw StatusError(e.status, e.data ? e.data.message : e.message);
};

const getAccountInfo = account => ({
  companyName: account.name,
  address: account.address.street,
  city: account.address.city,
  country: account.address.country,
  state: account.address.state,
  zip: account.address.zipCode,
});

/**
 * Create a Vendasta account for a clinic account,
 * neither Reviews nor Listing features are enabled.
 * Update the clinic account Vadasta info.
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function createAccount(account) {
  if (account.vendastaAccountId) {
    throw StatusError(
      StatusError.CONFLICT,
      'This account already has a Vendasta account',
    );
  }

  const customerIdentifier = uuid();

  try {
    const toCreateClinic = {
      ...getAccountInfo(account),
      customerIdentifier,
    };
    const { data: { data: { accountId: vendastaAccountId } } } = await axios.post(CREATE_ACCOUNT_URL, toCreateClinic);

    return account.update({
      vendastaId: customerIdentifier,
      vendastaAccountId,
    });
  } catch (e) {
    console.error('Vendasta Account Creation Failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Update the Vendasta info for a clinic account,
 * it will update the clinic name and address.
 *
 * @param account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function updateAccount(account) {
  if (!account.vendastaAccountId) {
    throw StatusError(
      StatusError.CONFLICT,
      'No Vendasta account associated with this account',
    );
  }

  try {
    const toUpdateClinic = {
      ...getAccountInfo(account),
      accountId: account.vendastaAccountId,
    };
    await axios.post(UPDATE_ACCOUNT_URL, toUpdateClinic);

    return account;
  } catch (e) {
    console.error('Vendasta update account failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Delete a Vendasta account for a clinic account,
 * All the Vendasta info in the clinic account will be removed.
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function deleteAccount(account) {
  if (!account.vendastaAccountId) {
    throw StatusError(
      StatusError.CONFLICT,
      'No Vendasta account associated with this account',
    );
  }

  try {
    const { data: { data } } = await axios.post(DELETE_ACCOUNT_URL, { accountId: account.vendastaAccountId });

    if (data.accountId !== account.vendastaAccountId) {
      throw StatusError(
        StatusError.BAD_REQUEST,
        'Vendasta delete account failed',
      );
    }

    return account.update({
      vendastaId: null,
      vendastaAccountId: null,
      vendastaMsId: null,
      vendastaSrId: null,
    });
  } catch (e) {
    console.error('Vendasta delete account failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Add reputation management (Reviews) to a clinic account,
 * the account.vendastaSrId will NOT be updated due to the fact that
 * the response from vendasta API endpoint does not have relating information
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function addReputationManagement(account) {
  if (account.vendastaSrId) {
    throw StatusError(
      StatusError.CONFLICT,
      'This account already has reputation management enabled',
    );
  }

  try {
    await axios.post(ADD_PRODUCT_URL, {
      accountId: account.vendastaAccountId,
      productId: 'RM',
    });

    return account;
  } catch (e) {
    console.error('Vendasta add reputation management failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Add Listings to a clinic account,
 * the account.vendastaMsId will NOT be updated due to the fact that
 * the response from vendasta API endpoint does not have relating information
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function addListings(account) {
  if (account.vendastaMsId) {
    throw StatusError(
      StatusError.CONFLICT,
      'This account already has listings enabled',
    );
  }

  try {
    await axios.post(ADD_PRODUCT_URL, {
      accountId: account.vendastaAccountId,
      productId: 'MS',
    });

    return account;
  } catch (e) {
    console.error('Vendasta add listings failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Disable listings for an account
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function disableListings(account) {
  if (!account.vendastaMsId) {
    throw StatusError(
      StatusError.CONFLICT,
      'Account does not enable listings feature',
    );
  }

  try {
    await axios.post(DISABLE_LISTINGS_URL, { msid: account.vendastaMsId });

    return account.update({ vendastaMsId: null });
  } catch (e) {
    console.error('Vendasta Listings Deletion Failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Disable reputation management for an account
 *
 * @param account the clinic account
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function disableReputationManagement(account) {
  if (!account.vendastaSrId) {
    throw StatusError(
      StatusError.CONFLICT,
      'Account does not enable reputation management feature',
    );
  }

  try {
    await axios.post(DISABLE_REPUTATION_MANAGEMENT_URL, { srid: account.vendastaSrId });

    return account.update({ vendastaSrId: null });
  } catch (e) {
    console.error('Vendasta Rep Management deletion Failed');
    console.error(e);
    errorHandling(e);
  }
}

/**
 * Update the productIds (listings or reviews) in carecru account.
 *
 * @param account to be updated
 * @returns {Promise<Account>}
 * @throws StatusError
 */
export async function updateProductIds(account) {
  if (!account.vendastaAccountId) {
    throw StatusError(
      StatusError.CONFLICT,
      'No Vendasta account associated with this account',
    );
  }

  try {
    const { data: { data: { productsJson } } } = await axios.get(`${GET_ACCOUNT_URL}&accountId=${account.vendastaAccountId}`);

    if (!Object.values(productsJson).length) {
      // No product found for this account, do not need to update
      return account;
    }

    const productIds = {
      vendastaMsId: (productsJson.MS && productsJson.MS.productId) || null,
      vendastaSrId: (productsJson.RM && productsJson.RM.productId) || null,
    };

    return account.update(productIds);
  } catch (e) {
    console.error('Vendasta get account Failed');
    console.error(e);
    errorHandling(e);
  }
}
