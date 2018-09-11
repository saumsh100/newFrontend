
import axios from 'axios';
import moment from 'moment-timezone';
import {
  setLoading,
  setInsights,
  setToDoReminders,
  setToDoReviews,
  setToDoRecalls,
} from '../reducers/dashboard';
import { convertIntervalStringToObject } from '../../server/util/time';

export function fetchInsights() {
  return async function (dispatch, getState) {
    try {
      const { dashboard } = getState();

      dispatch(setLoading({
        key: 'loadingInsights',
        value: true,
      }));

      const currentDate = moment(dashboard.get('dashboardDate'));
      const startDate = currentDate.startOf('day').toISOString();
      const endDate = currentDate.endOf('day').toISOString();

      const query = {
        startDate,
        endDate,
        limit: 100,
      };

      const insights = await axios('/api/appointments/insights', { params: query });

      dispatch(setInsights({ data: insights.data }));
      dispatch(setLoading({
        key: 'loadingInsights',
        value: false,
      }));
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
    const { auth, dashboard, entities } = getState();
    const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);
    const timezone = account.get('timezone');

    const currentDate = moment.tz(dashboard.get('dashboardDate'), timezone);
    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const recallBuffer = account.get('recallBuffer');

    if (toDoFunctions[index]) {
      const accountId = auth.get('accountId');
      dispatch(setLoading({
        key: 'loadingToDos',
        value: true,
      }));

      await toDoFunctions[index](accountId, startDate, endDate, dispatch, recallBuffer);
      return dispatch(setLoading({
        key: 'loadingToDos',
        value: false,
      }));
    }

    return dispatch(setToDoReminders([]));
  };
}

async function fetchToDoReminders(accountId, startDate, endDate, dispatch) {
  try {
    const params = {
      startDate,
      endDate,
    };
    const remindersData = await axios.get(`/api/accounts/${accountId}/reminders/outbox`, { params });
    dispatch(setToDoReminders(remindersData.data));
  } catch (err) {
    console.error('fetchToDoReminders', err);
    throw err;
  }
}

async function fetchToDoReviews(accountId, startDate, endDate, dispatch) {
  try {
    const params = {
      startDate,
      endDate,
    };
    const reviewsData = await axios.get(`/api/accounts/${accountId}/reviews/outbox`, { params });
    dispatch(setToDoReviews(reviewsData.data));
  } catch (err) {
    console.error('fetchToDoReviews', err);
    throw err;
  }
}

async function fetchToDoRecalls(accountId, startDate, endDate, dispatch, recallBuffer) {
  try {
    let endDateQuery = endDate;
    if (recallBuffer) {
      endDateQuery = moment(startDate)
        .add(convertIntervalStringToObject(recallBuffer))
        .toISOString();
    }

    const params = {
      startDate,
      endDate: endDateQuery,
    };
    const recallsData = await axios.get(`/api/accounts/${accountId}/recalls/outbox`, { params });
    dispatch(setToDoRecalls(recallsData.data));
  } catch (err) {
    console.error('fetchToDoRecalls', err);
    throw err;
  }
}
