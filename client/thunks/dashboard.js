import {
  setLoading,
  setInsights,
  setToDoReminders,
  setToDoReviews,
  setToDoRecalls,
} from '../reducers/dashboard';
import { httpClient } from '../util/httpClient';
import { getTodaysDate, getUTCDate, parseDate } from '../components/library/util/datetime';

const convertIntervalStringToObject = interval => {
  const array = interval.split(' ');

  // Defaults to be overridden
  const intervalData = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  // IMPORTANT! We increment by 2 to get only hours (30 min intervals)
  let i;
  for (i = 0; i < array.length; i += 2) {
    const quantity = parseFloat(array[i]);
    const type = array[i + 1];
    intervalData[type] = quantity;
  }

  return intervalData;
};

export function fetchInsights() {
  return async function(dispatch, getState) {
    try {
      const { auth, dashboard, entities } = getState();
      const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);
      const timezone = account.get('timezone');

      dispatch(
        setLoading({
          key: 'loadingInsights',
          value: true,
        }),
      );

      const currentDate = getUTCDate(dashboard.get('dashboardDate'), timezone);
      const startDate = currentDate.startOf('day').toISOString();
      const endDate = currentDate.endOf('day').toISOString();

      const query = {
        startDate,
        endDate,
        limit: 100,
      };

      const insights = await httpClient().get('/api/appointments/insights', {
        params: query,
      });

      dispatch(setInsights({ data: insights.data }));
      dispatch(
        setLoading({
          key: 'loadingInsights',
          value: false,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };
}

const toDoFunctions = {
  0: fetchToDoReminders,
  1: fetchToDoRecalls,
  2: fetchToDoReviews,
  3: fetchToDoWaitlist,
};

export function fetchDonnasToDos(index) {
  return async function(dispatch, getState) {
    const { auth, dashboard, entities } = getState();
    const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);
    const timezone = account.get('timezone');

    const currentDate = parseDate(dashboard.get('dashboardDate'), timezone);
    const isToday = currentDate.isSame(getTodaysDate(timezone), 'day');

    const now = getTodaysDate(timezone).toISOString();
    const startDate = isToday && index === 2 ? now : currentDate.startOf('day').toISOString();

    const endDate = currentDate.endOf('day').toISOString();

    const recallBuffer = account.get('recallBuffer');

    if (toDoFunctions[index]) {
      const accountId = auth.get('accountId');
      dispatch(
        setLoading({
          key: 'loadingToDos',
          value: true,
        }),
      );

      await toDoFunctions[index](accountId, startDate, endDate, dispatch, recallBuffer);
      return dispatch(
        setLoading({
          key: 'loadingToDos',
          value: false,
        }),
      );
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
    const remindersData = await httpClient().get(`/api/accounts/${accountId}/reminders/outbox`, {
      params,
    });
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
    const reviewsData = await httpClient().get(`/api/accounts/${accountId}/reviews/outbox`, {
      params,
    });
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
      endDateQuery = getUTCDate(startDate)
        .add(convertIntervalStringToObject(recallBuffer))
        .toISOString();
    }
    const params = {
      startDate,
      endDate: endDateQuery,
    };
    const recallsData = await httpClient().get(`/api/accounts/${accountId}/recalls/outbox`, {
      params,
    });
    dispatch(setToDoRecalls(recallsData.data));
  } catch (err) {
    console.error('fetchToDoRecalls', err);
    throw err;
  }
}

async function fetchToDoWaitlist() {
  console.log('fetchTodoWaitlist');
}
