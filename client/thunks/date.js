import { setScheduleDate } from '../actions/date';

export default function setCurrentScheduleDate(scheduleDate) {
  return function (dispatch, getState) {
    dispatch(setScheduleDate({ scheduleDate }));
  };
}
