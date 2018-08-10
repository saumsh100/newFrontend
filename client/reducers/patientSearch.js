
import { fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const SET_PATIENT_SEARCHED = '@patientSearch/SET_PATIENT_SEARCHED';
export const SET_SEARCH_LIST = '@patientSearch/SET_SEARCH_LIST';
export const SET_SEARCHES_LIMIT = '@patientSearch/SET_SEARCHES_LIMIT';

export const setPatientSearchedAction = createAction(SET_PATIENT_SEARCHED);
export const setPatientSearchedListAction = createAction(SET_SEARCH_LIST);
export const setPatientSearchesLimitAction = createAction(SET_SEARCHES_LIMIT);

const initialState = fromJS({
  listLimit: 10,
  searchedPatients: [],
});

export default handleActions(
  {
    [SET_SEARCHES_LIMIT](state, action) {
      return state.set('listLimit', action.payload);
    },
    [SET_SEARCH_LIST](state, action) {
      return state.set('searchedPatients', List(action.payload));
    },
    [SET_PATIENT_SEARCHED](state, action) {
      let newList = state.get('searchedPatients').unshift(action.payload);

      if (state.get('searchedPatients').size >= state.get('listLimit')) {
        newList = newList.pop();
      }

      return state.set(
        'searchedPatients',
        newList
          .groupBy(x => x.ccId)
          .map(x => x.first())
          .toList(),
      );
    },
  },
  initialState,
);
