
import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const reducer = '@waitingRoom';

export const SET_IS_FETCHING_WAITING_ROOM_QUEUE = `${reducer}/SET_IS_FETCHING_WAITING_ROOM_QUEUE`;
export const SET_WAITING_ROOM_QUEUE = `${reducer}/SET_WAITING_ROOM_QUEUE`;
export const SET_DEFAULT_TEMPLATE = `${reducer}/SET_DEFAULT_TEMPLATE`;
export const UPDATE_WAITING_ROOM_PATIENT = `${reducer}/UPDATE_WAITING_ROOM_PATIENT`;
export const REMOVE_WAITING_ROOM_PATIENT = `${reducer}/REMOVE_WAITING_ROOM_PATIENT`;

export const setIsFetchingWaitingRoomQueue = createAction(SET_IS_FETCHING_WAITING_ROOM_QUEUE);
export const setWaitingRoomQueue = createAction(SET_WAITING_ROOM_QUEUE);
export const setDefaultTemplate = createAction(SET_DEFAULT_TEMPLATE);
export const updateWaitingRoomPatient = createAction(UPDATE_WAITING_ROOM_PATIENT);
export const removeWaitingRoomPatient = createAction(REMOVE_WAITING_ROOM_PATIENT);

export const initialState = Map({
  isFetchingWaitingRoomQueue: false,
  waitingRoomQueue: null,
  defaultTemplate: null,
});

export default handleActions(
  {
    [SET_IS_FETCHING_WAITING_ROOM_QUEUE](state, { payload }) {
      return state.set('isFetchingWaitingRoomQueue', payload);
    },

    [SET_WAITING_ROOM_QUEUE](state, { payload }) {
      if (state.get('waitingRoomQueue')?.length === 0 && payload?.length === 0) return state;
      return state.set('waitingRoomQueue', payload);
    },

    [SET_DEFAULT_TEMPLATE](state, { payload }) {
      return state.set('defaultTemplate', payload);
    },

    [UPDATE_WAITING_ROOM_PATIENT](state, { payload: { id, ...rest } }) {
      const waitingRoomQueue = state.get('waitingRoomQueue');
      const index = waitingRoomQueue.findIndex(w => w.id === id);
      const waitingRoomPatient = waitingRoomQueue[index];
      const newWaitingRoomQueue = [...waitingRoomQueue];
      newWaitingRoomQueue[index] = { ...waitingRoomPatient,
        ...rest };
      return state.set('waitingRoomQueue', newWaitingRoomQueue);
    },

    [REMOVE_WAITING_ROOM_PATIENT](state, { payload }) {
      const waitingRoomQueue = state.get('waitingRoomQueue');
      const newWaitingRoomQueue = waitingRoomQueue.filter(w => w.id !== payload);
      return state.set('waitingRoomQueue', newWaitingRoomQueue);
    },
  },
  initialState,
);
