import { Map } from 'immutable';
import {
  updateEntityRequest,
  createEntityRequest
} from './fetchEntities';

// To understand which form data is used.
// ['addEnterprise', 'clinicDetails', 'addressDetai 'selectAccountOptions', 'addUser'];

export function setAllAccountInfo(payload) {
  return async (dispatch, getState) => {
    try {
      const alertCreateEnterprise = {
        success: {
          body: 'Enterprise has been created',
        },
        error: {
          body: 'Enterprise creation failed',
        },
      };

      let enterpriseId = null;
      // creating enterprise
      if (!payload.formData[0].id) {
        const createEnterprise = await dispatch(createEntityRequest({ key: 'enterprises', entityData: payload.formData[0], alert: alertCreateEnterprise  }));
        enterpriseId = Object.keys(createEnterprise.enterprises)[0];
      } else {
        enterpriseId = payload.formData[0].id;
      }

      const query = payload.formData[4]; // query for account options

      const alertCreateAccount = {
        success: {
          body: 'Account has been created',
        },
        error: {
          body: 'Account creation failed',
        },
      };

      // creating an account for this enterprise
      const createdAccount = await dispatch(createEntityRequest({
        key: 'accounts',
        entityData: { ...payload.formData[1], ...payload.formData[2] },
        url: `/api/enterprises/${enterpriseId}/accounts`,
        params: query,
        alert: alertCreateAccount,
      }));

      // updating account information
      const accountId = Object.keys(createdAccount.accounts)[0];
      const url = `/api/accounts/${accountId}`;


      await dispatch(updateEntityRequest({
        key: 'accounts',
        values: Object.assign({}, payload.formData[1], payload.formData[2], payload.formData[4]),
        url,
      }));


      // creating a user for this account
      const urlNewUser = `/api/accounts/${accountId}/newUser/`;
      const userData = payload.formData[3];
      const alertCreatedUser = {
        success: {
          body: 'User has been created',
        },
        error: {
          body: 'User creation failed',
        },
      };

      userData.accountId = accountId;
      userData.role = 'OWNER';

      await dispatch(createEntityRequest({
        key: 'user',
        entityData: userData,
        url: urlNewUser,
        alert: alertCreatedUser,
      }));
    } catch (error) {
      console.log(error);
    }
  };
}
