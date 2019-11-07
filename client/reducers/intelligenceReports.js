
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const reducer = '@intelligenceReports';
export const SET_REPORT_PARAMETER = `${reducer}/SET_REPORT_PARAMETER`;
export const SET_ACTIVE_REPORT = `${reducer}/SET_ACTIVE_REPORT`;

export const setReportParameters = createAction(SET_REPORT_PARAMETER);
export const setActiveReport = createAction(SET_ACTIVE_REPORT);

export const initialState = fromJS({
  reports: {},
  active: '',
});

export default handleActions(
  {
    [SET_REPORT_PARAMETER](
      state,
      {
        payload: { key, value },
      },
    ) {
      return state.setIn(['reports', key], value);
    },
    [SET_ACTIVE_REPORT](state, { payload }) {
      return state.set('active', payload);
    },
  },
  initialState,
);
