
import axios from 'axios';
import moment from 'moment';
import { setLoading, setInsights, setToDoReminders} from '../reducers/dashboard';

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

const toDoFunctions = [
  fetchToDoReminders,
];

export function fetchDonnasToDos(index) {
  return async function (dispatch, getState) {
    const {
      auth,
      dashboard,
    } = getState();

    const currentDate = moment(dashboard.toJS().dashboardDate);
    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    if (index < toDoFunctions.length) {
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
    console.log(err);
  }
}
