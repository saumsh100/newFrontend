
import axios from 'axios';
import moment from 'moment-timezone';
import {
  setLoading,
  setInsights,
  setToDoReminders,
  setToDoReviews,
  setToDoRecalls,
} from '../reducers/dashboard';

export function fetchInsights() {
  return async function (dispatch, getState) {
    try {
      const {
        dashboard,
      } = getState();

      dispatch(setLoading({ key: 'loadingInsights', value: true }));

      const currentDate = moment(dashboard.toJS().dashboardDate);
      const startDate = currentDate.startOf('day').toISOString();
      const endDate = currentDate.endOf('day').toISOString();

      const query = {
        startDate,
        endDate,
        limit: 100,
      };

      const insights = await axios('/api/appointments/insights', { params: query });

      dispatch(setInsights({ data: insights.data }));
      dispatch(setLoading({ key: 'loadingInsights', value: false }));
    } catch (err) {
      console.log(err);
    }
  };
}

const toDoFunctions = {
  0: fetchToDoReminders,
  1: fetchToDoRecalls,
  2: fetchToDoReviews,
};

export function fetchDonnasToDos(index) {
  return async function (dispatch, getState) {
    const {
      auth,
      dashboard,
      entities,
    } = getState();

    const currentDate = moment(dashboard.toJS().dashboardDate);
    let startDate = currentDate.startOf('day').toISOString();
    let endDate = currentDate.endOf('day').toISOString();
    const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);

    if (account.timezone) {
      startDate = moment.tz(currentDate, account.timezone).startOf('day').toISOString();
      endDate = moment.tz(currentDate, account.timezone).endOf('day').toISOString();
    }

    if (toDoFunctions[index]) {
      const accountId = auth.get('accountId');
      dispatch(setLoading({ key: 'loadingToDos', value: true }));

      await toDoFunctions[index](accountId, startDate, endDate, dispatch);
      return dispatch(setLoading({ key: 'loadingToDos', value: false }));
    }

    return dispatch(setToDoReminders([]));
  };
}

async function fetchToDoReminders(accountId, startDate, endDate, dispatch) {
  try {
    const params = { startDate, endDate };
    const remindersData = await axios.get(`/api/accounts/${accountId}/reminders/outbox`, { params });
    dispatch(setToDoReminders(remindersData.data));
  } catch (err) {
    console.error('fetchToDoReminders', err);
    throw err;
  }
}

async function fetchToDoReviews(accountId, startDate, endDate, dispatch) {
  try {
    const params = { startDate, endDate };
    const reviewsData = await axios.get(`/api/accounts/${accountId}/reviews/outbox`, { params });
    dispatch(setToDoReviews(reviewsData.data));
  } catch (err) {
    console.error('fetchToDoReviews', err);
    throw err;
  }
}

async function fetchToDoRecalls(accountId, startDate, endDate, dispatch) {
  try {
    const params = { startDate, endDate };
    const recallsData = await axios.get(`/api/accounts/${accountId}/recalls/outbox`, { params });
    dispatch(setToDoRecalls(recallsData.data));
  } catch (err) {
    console.error('fetchToDoRecalls', err);
    throw err;
  }
}

