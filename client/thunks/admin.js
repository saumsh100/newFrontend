import { Map } from 'immutable';
import {
  updateEntityRequest,
  createEntityRequest
} from './fetchEntities';

export function setAllAccountInfo(payload) {
  return async (dispatch, getState) => {

    try {
      const createEnterprise = await dispatch(createEntityRequest({ key: 'enterprises', entityData: payload.formData[0] }));
      const enterpriseId = Object.keys(createEnterprise.enterprises)[0];
      const createAccount = await dispatch(createEntityRequest({
        key: 'accounts',
        entityData: payload.formData[1],
        url: `/api/enterprises/${enterpriseId}/accounts`,
      }));

      const accountId = Object.keys(createAccount.accounts)[0];
      const url = `/api/accounts/${accountId}`;
      await dispatch(updateEntityRequest({ key: 'accounts', values: payload.formData[1], url }));

      const urlNewUser = `/api/accounts/${accountId}/newUser/`;
      const userData = payload.formData[2];
      userData.accountId = accountId;
      await dispatch(createEntityRequest({ key: 'user', entityData: userData, url: urlNewUser }));

    } catch (error) {
      console.log(error);
    }
  };
}
