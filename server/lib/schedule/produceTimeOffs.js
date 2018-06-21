
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

/**
 * produceTimeOffs is a function that converts the general recurringTimeOffs objects
 * into more static timeOffs for a given range of time
 *
 * @param  {[array]} recurringTimeOffs
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @return {[array]} [array of objects of timeOffs]
 */
export default function produceTimeOffs(recurringTimeOffs, startDate, endDate) {
  const fullTimeOffs = [];
  for (let i = 0; i < recurringTimeOffs.length; i++) {
    if (!recurringTimeOffs[i].dayOfWeek) {
      fullTimeOffs.push(recurringTimeOffs[i]);
      continue;
    }

    let startDay;
    let endDay;

    if (recurringTimeOffs[i].allDay) {
      startDay = recurringTimeOffs[i].startDate;
      endDay = recurringTimeOffs[i].startDate;
    } else {
      startDay = new Date(recurringTimeOffs[i].startDate);
      const startTime = new Date(recurringTimeOffs[i].startTime);
      startDay.setHours(startTime.getHours());
      startDay.setMinutes(startTime.getMinutes());

      endDay = new Date(recurringTimeOffs[i].startDate);
      const endTime = new Date(recurringTimeOffs[i].endTime);
      endDay.setHours(endTime.getHours());
      endDay.setMinutes(endTime.getMinutes());
    }

    const start = moment(startDay);
    const end = moment(endDay);

    const dayOfWeek = moment()
      .day(recurringTimeOffs[i].dayOfWeek)
      .isoWeekday();

    const tmpStart = start.clone().day(dayOfWeek);
    const tmpEnd = end.clone().day(dayOfWeek);

    let count = 1;

    // test for first day of the week (seeing if it comes before or after when we changed the day of the week)

    if (tmpStart.isAfter(start, 'd') || tmpStart.isSame(start, 'd')) {
      if (tmpStart.isAfter(startDate)) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    } else {
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');

      if (tmpStart.isAfter(startDate)) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }

    // loop through and create regular time offs until the end date of the requested avaliabilities
    while (tmpStart.isBefore(moment(recurringTimeOffs[i].endDate)) && tmpStart.isBefore(endDate)) {
      if (
        count % recurringTimeOffs[i].interval === 0 &&
        count >= recurringTimeOffs[i].interval &&
        moment(startDate).isBefore(tmpStart)
      ) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      count++;
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }
  }

  return fullTimeOffs;
}
