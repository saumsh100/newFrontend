
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import Account from '../entities/models/Account';
import Review from '../entities/models/Review';

/**
 * Constants
 */
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_REVIEW = 'SET_REVIEW';
export const MERGE_REVIEW_VALUES = 'MERGE_REVIEW_VALUES';

/**
 * Actions
 */
export const setAccount = createAction(SET_ACCOUNT);
export const setReview = createAction(SET_REVIEW);
export const mergeReviewValues = createAction(MERGE_REVIEW_VALUES);

/**
 * Initial State
 */
export const createInitialReviewsState = state => {
  return fromJS(Object.assign({
    account: null,
    review: new Review(),
  }, state));
};

export const initialState = createInitialReviewsState();

/**
 * Reducer
 */
export default handleActions({
  [SET_ACCOUNT](state, { payload }) {
    return state.set('account', new Account(payload));
  },

  [SET_REVIEW](state, { payload }) {
    return state.set('review', new Review(payload));
  },

  [MERGE_REVIEW_VALUES](state, { payload }) {
    return state.mergeIn(['review'], payload);
  },
}, initialState);