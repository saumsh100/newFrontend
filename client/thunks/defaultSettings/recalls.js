
import { deleteAllEntity } from '../../reducers/entities';
import createEntityRequest from '../fetchEntities/createEntityRequest';

/**
 * revertRecallsTouchpoints is a thunk used to clear the existing recalls touchpoints in
 * the redux store and call the revert endpoint to replenish with the new touchpoints
 *
 * @param account
 * @param alert
 * @returns {function(*): *}
 */
export default function revertRecallsTouchpoints({ account, alert }) {
  return (dispatch) => {
    dispatch(deleteAllEntity('recalls'));
    return dispatch(
      createEntityRequest({
        key: 'recalls',
        url: `/api/accounts/${account.id}/recalls/revert`,
        alert,
      }),
    );
  };
}
