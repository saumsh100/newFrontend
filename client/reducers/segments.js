import { handleActions } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_ERROR,
  PREVIEW_SEGMENT_SUCCESS,
  SEGMENTS_FETCH_CITIES_ATTEMPT,
  SEGMENTS_FETCH_CITIES_ERROR,
  SEGMENTS_FETCH_CITIES_SUCCESS,
  SEGMENT_APPLY,
  SEGMENT_REMOVE_APPLIED,
} from '../constants';

const initialState = {
  loading: false,
  loadingCities: false,
  preview: {},
  cities: [],
  error: null,
  errorCities: null,
  applied: false,
  rawWhere: {},
};

export default handleActions({
  [PREVIEW_SEGMENT_ATTEMPT](state) {
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

  [SEGMENTS_FETCH_CITIES_ATTEMPT](state) {
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

  [SEGMENT_APPLY](state, action) {
    return {
      ...state,
      applied: true,
      rawWhere: action.payload,
    };
  },
  [SEGMENT_REMOVE_APPLIED](state) {
    return {
      ...state,
      applied: false,
      rawWhere: {},
    };
  },
}, initialState);
