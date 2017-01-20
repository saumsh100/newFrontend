import { loginSuccess } from '../actions/entities'

export default function setScheduleDate(scheduleDate) {
  return function (dispatch, getState) {
    dispatch(loginSuccess({ scheduleDate }));
  };
}
