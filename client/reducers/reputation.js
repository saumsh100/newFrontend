
import { fromJS } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import { SET_REPUTATION_FILTER, SET_FILTERS_LOADED } from '../constants';

const SET_REVIEWS_DATA = 'SET_REVIEWS_DATA';

export const setReviewsData = createAction(SET_REVIEWS_DATA);

const initialState = fromJS({
  reviewsfiltersloaded: false,
  reviewsData: [],
  reviewsList: [],
  reviewsFilter: {
    sources: [],
    ratings: [],
  },
  listingsFilter: {
    sourceTypes: ['Search Engines', 'Review Sites', 'Directories', 'Social Sites'],
    listingStatuses: ['Accurate', 'Found with Possible Errors', 'Not Found'],
  },
});

export default handleActions(
  {
    [SET_REPUTATION_FILTER](state, action) {
      const { key } = action.payload;
      const mergeObj = {};
      mergeObj[key] = action.payload.filterData;
      return state.merge(mergeObj);
    },

    [SET_FILTERS_LOADED](state, action) {
      return state.merge({ reviewsFilterloaded: action.payload.data });
    },

    [SET_REVIEWS_DATA](state, action) {
      return state.merge({
        reviewsData: action.payload.reviewsData,
        reviewsList: action.payload.reviewsList,
      });
    },
  },
  initialState,
);
