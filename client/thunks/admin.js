import { Map } from 'immutable';
import {
  updateEntityRequest,
  createEntityRequest
} from './fetchEntities';

// To understand which form data is used.
// ['addEnterprise', 'clinicDetails', 'selectAccountOptions', 'addUser'];

export function setAllAccountInfo(payload) {
  return async (dispatch, getState) => {

    try {
      let enterpriseId = null;
      // creating enterprise
      if (!payload.formData[0].id) {
        const createEnterprise = await dispatch(createEntityRequest({ key: 'enterprises', entityData: payload.formData[0] }));
        enterpriseId = Object.keys(createEnterprise.enterprises)[0];
      } else {
        enterpriseId = payload.formData[0].id;
      }


      const query = payload.formData[2]; // query for account options

      // creating an account for this enterprise
      const createdAccount = await dispatch(createEntityRequest({
        key: 'accounts',
        entityData: payload.formData[1],
        url: `/api/enterprises/${enterpriseId}/accounts`,
        params: query,
      }));

      // updating account information
      const accountId = Object.keys(createdAccount.accounts)[0];
      const url = `/api/accounts/${accountId}`;
      await dispatch(updateEntityRequest({
        key: 'accounts',
        values: Object.assign({}, payload.formData[1]),
        url,
      }));


      // creating a user for this account
      const urlNewUser = `/api/accounts/${accountId}/newUser/`;
      const userData = payload.formData[3];
      userData.accountId = accountId;
      await dispatch(createEntityRequest({
        key: 'user',
        entityData: userData,
        url: urlNewUser,
      }));
    } catch (error) {
      console.log(error);
    }
  };
}
