
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const reducer = '@widget-navigation';

export const initialState = fromJS({
  backTo: '/',
  next: '/',
  booking: '/',
  account: '/',
  review: '/',
  hasSelectedDate: false,
  isEditing: false,
});

export const BACK_TO_SET = `${reducer}/BACK_TO_SET`;
export const NEXT_SET = `${reducer}/NEXT_SET`;
export const BOOKNG_SET = `${reducer}/BOOKNG_SET`;
export const ACCOUNT_SET = `${reducer}/ACCOUNT_SET`;
export const REVIEW_SET = `${reducer}/REVIEW_SET`;
export const IS_READY_TO_BOOK_SET = `${reducer}/IS_READY_TO_BOOK_SET`;
export const IS_EDITING_SET = `${reducer}/IS_EDITING_SET`;

export const backToSet = createAction(BACK_TO_SET);
export const nextSet = createAction(NEXT_SET);
export const bookngSet = createAction(BOOKNG_SET);
export const accountSet = createAction(ACCOUNT_SET);
export const reviewSet = createAction(REVIEW_SET);
export const hasSelectedDateSet = createAction(IS_READY_TO_BOOK_SET);
export const isEditingSet = createAction(IS_EDITING_SET);

const navigation = () => ({
  reason: [],
  review: ['next'],
  account: ['next'],
});

export const selectAvailableActions = (state, page) => {
  if (state.isEditing) {
    return ['cancel', 'confirm'];
  }

  return navigation()[page] || [];
};

export default handleActions(
  {
    [BACK_TO_SET](state, { payload }) {
      return state.set('backTo', payload);
    },
    [NEXT_SET](state, { payload }) {
      return state.set('next', payload);
    },
    [BOOKNG_SET](state, { payload }) {
      return state.set('booking', payload);
    },
    [ACCOUNT_SET](state, { payload }) {
      return state.set('account', payload);
    },
    [REVIEW_SET](state, { payload }) {
      return state.set('review', payload);
    },
    [IS_READY_TO_BOOK_SET](state, { payload }) {
      return state.set('hasSelectedDate', payload);
    },
    [IS_EDITING_SET](state, { payload }) {
      return state.set('isEditing', payload);
    },
  },
  initialState,
);
