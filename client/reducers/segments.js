import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_ERROR,
  PREVIEW_SEGMENT_SUCCESS,
} from '../constants';

const initialState = fromJS({
  loading: false,
  preview: {},
  error: null,
});

export default handleActions({
  [PREVIEW_SEGMENT_ATTEMPT](state, action) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  },
}, initialState);
