
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/**
 * Constants
 */
export const SET_DASHBOARD_DATE = 'SET_DASHBOARD_DATE';
export const SET_INSIGHTS = 'SET_INSIGHTS';
export const SET_TODO_REMINDERS = 'SET_REMINDERS';
export const SET_TODO_REVIEWS = 'SET_REVIEWS';
export const SET_TODO_RECALLS = 'SET_TODO_RECALLS';
export const SET_LOADING = 'SET_LOADING';

/**
 * Actions
 */
export const setDashboardDate = createAction(SET_DASHBOARD_DATE);
export const setInsights = createAction(SET_INSIGHTS);
export const setToDoReminders = createAction(SET_TODO_REMINDERS);
export const setToDoRecalls = createAction(SET_TODO_RECALLS);
export const setToDoReviews = createAction(SET_TODO_REVIEWS);
export const setLoading = createAction(SET_LOADING);

/**
 * Initial State
 */
export const createInitialDashboardState = state =>
  fromJS(
    Object.assign(
      {
        dashboardDate: localStorage.getItem('dashboardDate') || new Date().toISOString(),
        loadingInsights: false,
        loadingToDos: false,
        insightCount: 0,
        insights: [],
        reminders: [],
        reviews: [],
        recalls: [],
      },
      state,
    ),
  );

export const initialState = createInitialDashboardState();

/**
 * Reducer
 */
export default handleActions(
  {
    [SET_DASHBOARD_DATE](state, { payload }) {
      return state.set('dashboardDate', payload);
    },

    [SET_LOADING](state, { payload }) {
      return state.set(payload.key, payload.value);
    },

    [SET_INSIGHTS](state, { payload }) {
      const insights = payload.data;

      let insightCount = 0;
      insights.forEach((data) => {
        insightCount += data.insights.length;
      });

      return state.merge({
        insights,
        insightCount,
      });
    },

    [SET_TODO_REMINDERS](state, { payload }) {
      return state.merge({ reminders: payload });
    },

    [SET_TODO_RECALLS](state, { payload }) {
      return state.merge({ recalls: payload });
    },

    [SET_TODO_REVIEWS](state, { payload }) {
      return state.merge({ reviews: payload });
    },
  },
  initialState,
);
