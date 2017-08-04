
import { Record, Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const CREATE_REQUEST = '@apiRequests/CREATE_REQUEST';
export const RECEIVE_REQUEST = '@apiRequests/RECEIVE_REQUEST';
export const ERROR_REQUEST = '@apiRequests/ERROR_REQUEST';

export const createRequest = createAction(CREATE_REQUEST);
export const receiveRequest = createAction(RECEIVE_REQUEST);
export const errorRequest = createAction(ERROR_REQUEST);


export const APIRequest = Record({
  isFetching: false,
  wasFetched: false,
  fetchedAt: null,
  error: null,
  data: null,
});

export const initialState = Map();

export default handleActions({
  [CREATE_REQUEST](state, { payload: { id } }) {
    return state.set(id, new APIRequest({ isFetching: true }));
  },

  [RECEIVE_REQUEST](state, { payload: { id, data } }) {
    return state.mergeIn([id], {
      isFetching: false,
      wasFetched: true,
      fetchedAt: Date.now(),
      data,
    });
  },

  [ERROR_REQUEST](state, { payload: { id, error } }) {
    return state.mergeIn([id], {
      error,
      isFetching: false,
      wasFetched: true,
    });
  },
}, initialState);
