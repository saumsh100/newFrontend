
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const reducer = '@accountSettings';
export const SET_SERVICE_ID = `${reducer}/SET_SERVICE_ID`;
export const SET_PRACTITIONER_ID = `${reducer}/SET_PRACTITIONER_ID`;

export const setServiceId = createAction(SET_SERVICE_ID);
export const setPractitionerId = createAction(SET_PRACTITIONER_ID);

export const initialState = fromJS({
  serviceId: null,
  practitionerId: null,
});

export default handleActions(
  {
    [SET_SERVICE_ID](
      state,
      { payload: { id } },
    ) {
      if (state.get('serviceId') === id) {
        return state;
      }

      return state.set('serviceId', id);
    },

    [SET_PRACTITIONER_ID](
      state,
      { payload: { id } },
    ) {
      if (state.get('practitionerId') === id) {
        return state;
      }

      return state.set('practitionerId', id);
    },
  },
  initialState,
);
