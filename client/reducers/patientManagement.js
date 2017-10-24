
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/**
 * Constants
 */
export const SET_SMART_FILTER = 'SET_SMART_FILTER';
export const REMOVE_SMART_FILTER = 'REMOVE_SMART_FILTER';

/**
 * Actions
 */
export const setSmartFilter = createAction(SET_SMART_FILTER);
export const removeSmartFilter = createAction(REMOVE_SMART_FILTER);


/**
* Initial State
*/
const initialState = fromJS({
  smartFilters: [],
});

/**
 * Reducer
 */
export default handleActions({
  [SET_SMART_FILTER](state,action) {
    return state.merge({
      smartFilters: action.payload.filterData,
    });
  },
  [REMOVE_SMART_FILTER](state, action) {
    const filterState = state.toJS()['smartFilters'];

    filterState.map((filter) => {
      if (filter.id === action.payload.id) {
        const dataArray = filter.data.filter((data) => {
          return data !== action.payload.tag;
        });
        filter.data = dataArray;
      }
      return filter;
    });

    return state.merge({
      smartFilters: filterState,
    });
  },
}, initialState);
