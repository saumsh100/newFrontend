
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const SET_PATIENT_RECENT_SEARCHED = '@patientSearch/SET_RECENT_PATIENT_SEARCH';
export const SET_RECENT_SEARCHES_LIMIT = '@patientSearch/SET_RECENT_SEARCHES_LIMIT';

export const setPatientRecentSearched = createAction(SET_PATIENT_RECENT_SEARCHED);
export const setRecentSearchesLimit = createAction(SET_RECENT_SEARCHES_LIMIT);

const initialState = fromJS({
  listLimit: 10,
  recentSearchedPatients: [],
});

export default handleActions(
  {
    [SET_RECENT_SEARCHES_LIMIT](state, action) {
      return state.set('listLimit', action.payload);
    },
    [SET_PATIENT_RECENT_SEARCHED](state, action) {
      let newList = state.get('recentSearchedPatients').unshift(action.payload);

      if (state.get('recentSearchedPatients').size >= state.get('listLimit')) {
        newList = newList.pop();
      }

      return state.set(
        'recentSearchedPatients',
        newList
          .groupBy(x => x.ccId)
          .map(x => x.first())
          .toList()
      );
    },
  },
  initialState
);
