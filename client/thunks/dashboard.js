
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
    } = getState();

    if (index < toDoFunctions.length) {
      const accountId = auth.get('accountId');
      dispatch(setLoading({ key: 'loadingToDos', value: true }));

      await toDoFunctions[index](accountId, dispatch);
      return dispatch(setLoading({ key: 'loadingToDos', value: false }));
    }

    return dispatch(setToDoReminders([]));
  };
}

async function fetchToDoReminders(accountId, dispatch) {
  try {
    const remindersData = await axios.get(`/api/accounts/${accountId}/reminders/outbox`);

    dispatch(setToDoReminders(remindersData.data));
  } catch (err) {
    console.log(err);
  }
}
