import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_ERROR,
  PREVIEW_SEGMENT_SUCCESS,
  SEGMENTS_FETCH_CITIES_ATTEMPT,
  SEGMENTS_FETCH_CITIES_ERROR,
  SEGMENTS_FETCH_CITIES_SUCCESS,
} from '../constants';

const initialState = {
  loading: false,
  loadingCities: false,
  preview: {},
  cities: [],
  error: null,
  errorCities: null,
};

export default handleActions({
  [PREVIEW_SEGMENT_ATTEMPT](state, action) {
    return {
      ...state,
      loading: true,
      error: null,
      preview: {},
    };
  },
  [PREVIEW_SEGMENT_SUCCESS](state, action) {
    return {
      ...state,
      loading: false,
      error: null,
      preview: action.payload,
    };
  },
  [PREVIEW_SEGMENT_ERROR](state, action) {
    return {
      ...state,
      loading: false,
      error: action.payload,
      preview: {},
    };
  },

  [SEGMENTS_FETCH_CITIES_ATTEMPT](state, action) {
    return {
      ...state,
      loadingCities: true,
      errorCities: null,
      cities: [],
    };
  },
  [SEGMENTS_FETCH_CITIES_SUCCESS](state, action) {
    return {
      ...state,
      loadingCities: false,
      errorCities: null,
      cities: action.payload,
    };
  },
  [SEGMENTS_FETCH_CITIES_ERROR](state, action) {
    return {
      ...state,
      loadingCities: false,
      errorCities: action.payload,
      cities: [],
    };
  },
}, initialState);
