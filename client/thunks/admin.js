import { Map } from 'immutable';
import {
  updateEntityRequest,
  createEntityRequest
} from './fetchEntities';

export async function setAllAccountInfo(payload) {
  return (dispatch, getState) => {

    dispatch(createEntityRequest({ key: 'enterprises', entityData: payload.formData[0] }))
      .then(({ enterprises }) => {
        const enterpriseId = Object.keys(enterprises)[0];

        dispatch(createEntityRequest({
          key: 'accounts',
          entityData: payload.formData[1],
          url: `/api/enterprises/${enterpriseId}/accounts`,
        })).then(({ accounts }) => {
          const accountId = Object.keys(accounts)[0];
          const url = `/api/accounts/${accountId}`;
          dispatch(updateEntityRequest({ key: 'accounts', values: payload.formData[1], url }));
        });
      });

  };
}
