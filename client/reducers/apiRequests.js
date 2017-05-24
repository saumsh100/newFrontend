
import { Record, Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import extend from 'lodash/extend';

export const CREATE_REQUEST = 'CREATE_REQUEST';
export const RECEIVE_REQUEST = 'RECEIVE_REQUEST';
export const ERROR_REQUEST = 'RECEIVE_REQUEST';

export const createRequest = createAction(CREATE_REQUEST);
export const receiveRequest = createAction(RECEIVE_REQUEST);
export const errorRequest = createAction(ERROR_REQUEST);


export const APIRequest = Record({
  isFetching: false,
  wasFetched: false,
  fetchedAt: null,
  error: null,
  responseData: null,
  pageData: null,
});

export const initialState = Map();

export default handleActions({
  [CREATE_REQUEST](state, { payload: { id } }) {
    return state.set(id, new APIRequest({ isFetching: true }));
  },

  [RECEIVE_REQUEST](state, { payload: { id, response } }) {
    return state.mergeIn([id], extend({}, response, {
      isFetching: false,
      wasFetched: true,
      fetchedAt: Date.now(),
    }));
  },

  [ERROR_REQUEST](state, { payload: { key, error } }) {
    return state.mergeIn([key], {
      error,
      isFetching: false,
      wasFetched: true,
    });
  },
}, initialState);
