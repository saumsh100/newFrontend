
import moment from 'moment-timezone';
import { Appointment, DeliveredProcedure, WeeklySchedule, Account, sequelize } from '../../_models';

const endOfCurrentDay = timezone => moment().tz(timezone).endOf('day').toISOString();
const startOfCurrentDay = timezone => moment().tz(timezone).startOf('day').toISOString();

/**
 * calcRevenueDays is an async function that will calculate the total revenue
 * of the current day and the previous 12 days. Plus, the average of these days.
 *
 * @param  {accountId} Clinic accounts Id.
 * @param  {startDate} The selected date minus a number of days (default: endDate - 12)
 * @param  {endDate} The current selected date
 * @returns {totalRevObj} object with estimated revenue for the date range and the average
 */
export default async function calcRevenueDays(revParams) {
  try {
    const {
      date, pastDaysLimit, maxDates, accountId,
    } = revParams;

    const accountData = await Account.findOne({
      where: {
        id: accountId,
      },
      include: [
        {
          model: WeeklySchedule,
          as: 'weeklySchedule',
        },
      ],
      nest: true,
      raw: true,
    });

    const timezone = accountData.timezone || 'America/Vancouver';

    const selectedDate = moment
      .tz(date, timezone)
      .endOf('day')
      .toISOString();
    const dateRangeInt = pastDaysLimit;

    const weeklySchedule = accountData.weeklySchedule;

    const closedDates = getClosedClinicDates(weeklySchedule, selectedDate, dateRangeInt, timezone);

    if (
      closedDates.indexOf(moment
        .tz(date, timezone)
        .endOf('day')
        .toISOString()) > -1
    ) {
      return {
        average: 0,
      };
    }

    const totalRevObj = await getAllDatesWithAppointments(
      selectedDate,
      closedDates,
      dateRangeInt,
      maxDates,
      accountId,
      timezone,
    );

    const { datesAfter, datesBefore, dateBetween } = getBeforeAfterTodayDates(
      totalRevObj,
      timezone,
    );

    if (datesAfter.length) {
      const sDateAfter = datesAfter[datesAfter.length - 1];
      const eDateAfter = datesAfter[0];

      const appointments = await Appointment.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isPending: false,
          isDeleted: false,
          isMissed: false,
          startDate: {
            $between: [
              moment
                .tz(sDateAfter, timezone)
                .startOf('day')
                .toISOString(),
              moment
                .tz(eDateAfter, timezone)
                .endOf('day')
                .toISOString(),
            ],
          },
          estimatedRevenue: {
            $not: null,
          },
        },
        attributes: ['estimatedRevenue', 'startDate'],
      });

      sumEstimatedProcedureRevenue(
        appointments,
        'startDate',
        totalRevObj,
        'estimatedRevenue',
        timezone,
      );
    }

    if (datesBefore.length) {
      const sDateBefore = datesBefore[datesBefore.length - 1];
      const eDateBefore = datesBefore[0];

      const deliveredProc = await DeliveredProcedure.findAll({
        raw: true,
        where: {
          accountId,
          entryDate: {
            $between: [
              moment
                .tz(sDateBefore, timezone)
                .startOf('day')
                .toISOString(),
              moment
                .tz(eDateBefore, timezone)
                .endOf('day')
                .toISOString(),
            ],
          },
          isCompleted: true,
        },
        group: ['DeliveredProcedure.id'],
        attributes: [
          'DeliveredProcedure.entryDate',
          [sequelize.fn('sum', sequelize.col('totalAmount')), 'totalRevenue'],
        ],
      });

      sumEstimatedProcedureRevenue(
        deliveredProc,
        'entryDate',
        totalRevObj,
        'totalRevenue',
        timezone,
      );
    }

    if (dateBetween.length) {
      const delProc = await DeliveredProcedure.findAll({
        raw: true,
        where: {
          accountId,
          entryDate: {
            $between: [
              moment()
                .tz(timezone)
                .startOf('day')
                .toISOString(),
              moment()
                .tz(timezone)
                .toISOString(),
            ],
          },
          isCompleted: true,
        },
        group: ['DeliveredProcedure.id'],
        attributes: [
          'DeliveredProcedure.entryDate',
          [sequelize.fn('sum', sequelize.col('totalAmount')), 'totalRevenue'],
        ],
      });

      const apps = await Appointment.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isPending: false,
          isDeleted: false,
          isMissed: false,
          endDate: {
            $between: [
              moment()
                .tz(timezone)
                .startOf('day')
                .toISOString(),
              moment()
                .tz(timezone)
                .endOf('day')
                .toISOString(),
            ],
          },
          estimatedRevenue: {
            $not: null,
          },
        },
        attributes: ['estimatedRevenue', 'startDate'],
      });

      sumEstimatedProcedureRevenue(delProc, 'entryDate', totalRevObj, 'totalRevenue', timezone);
      sumEstimatedProcedureRevenue(apps, 'startDate', totalRevObj, 'estimatedRevenue', timezone);
    }

    totalRevObj.average = calculateAverage(totalRevObj);

    return totalRevObj;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * getClosedClinicDates is a function that will calculate a new date object
 * excluding days the clinic is closed and appending days that it's open
 *
 * @param  {weeklySchedule} weeklySchedule of the clinc.
 * @param  {date} date is the current selected date
 * @param  {numOfDays} numOfDays is the max range of dates to query
 */

function getClosedClinicDates(weeklySchedule, date, numOfDays, timezone) {
  const closedDates = [];
  let i = 0;

  while (i < numOfDays) {
    const subDate = moment.tz(date, timezone).subtract(i, 'days');

    const dayofWeek = subDate.format('dddd').toLowerCase();
    const isClosed = weeklySchedule[dayofWeek].isClosed;

    if (isClosed) {
      closedDates.push(subDate.endOf('day').toISOString());
    }

    i += 1;
  }

  return closedDates;
}

/**
 * getAllDatesWithAppointments is an async function that will get all the appointments
 * between a date range
 *
 */
async function getAllDatesWithAppointments(
  selectedDate,
  closedDates,
  dateRangeInt,
  limit,
  accountId,
  timezone,
) {
  const appointments = await Appointment.findAll({
    where: {
      accountId,
      $and: [
        {
          startDate: {
            $between: [
              moment
                .tz(selectedDate, timezone)
                .subtract(dateRangeInt, 'days')
                .toISOString(),
              moment
                .tz(selectedDate, timezone)
                .endOf('day')
                .toISOString(),
            ],
          },
        },
      ],
      isPending: false,
      isCancelled: false,
      isDeleted: false,
      isMissed: false,
    },
    raw: true,
    required: true,
    attributes: ['startDate'],
    order: [['startDate', 'DESC']],
  });

  const appointmentObj = {};
  let i = 0;
  let countDates = 0;

  while (countDates < limit && i < appointments.length) {
    const app = appointments[i];
    const startDate = moment
      .tz(app.startDate, timezone)
      .endOf('day')
      .toISOString();
    if (!(startDate in appointmentObj) && closedDates.indexOf(startDate) === -1) {
      appointmentObj[startDate] = 0;
      countDates += 1;
    }
    i += 1;
  }
  
  if (endOfCurrentDay(timezone) in appointmentObj) {
    appointmentObj[startOfCurrentDay(timezone)] = 0;
  }
  return appointmentObj;
}

/**
 * getBeforeAfterTodayDates is a function that will sort the dates
 * by current day, before current day, and after current day.
 *
 * @param  {dateObj} dateObj object of dates
 * @returns {datesAfter,datesBefore,dateBetween} 3 arrays with corresponding dates
 */
function getBeforeAfterTodayDates(dateObj, timezone) {
  const datesBefore = [];
  const datesAfter = [];
  const dateBetween = [];

  const dateObjKeys = Object.keys(dateObj);

  dateObjKeys.forEach((date) => {
    const subDate = moment.tz(date, timezone);
    const isBefore = subDate.isBefore(moment().tz(timezone));
    const isBetween =
      subDate.isBetween(
        moment()
          .tz(timezone)
          .startOf('day'),
        moment()
          .tz(timezone)
          .endOf('day'),
      ) ||
      subDate.isSame(moment()
        .tz(timezone)
        .endOf('day')) || subDate.isSame(moment().tz(timezone).startOf('day'));

    const isAfter = subDate.isAfter(moment().tz(timezone));

    if (isBefore && !isBetween) {
      datesBefore.push(subDate.toISOString());
    }

    if (isAfter && !isBetween) {
      datesAfter.push(subDate.toISOString());
    }

    if (isBetween) {
      dateBetween.push(subDate.toISOString());
    }
  });

  return {
    datesAfter,
    datesBefore,
    dateBetween,
  };
}

/**
 * sumeEstimatedProdecureRevenue sums either the estimatedRevenue from a set of appointments
 * or totalRevenue from a set of deliveredProdecures. totalRevObj is a reference object that is
 * being mutated for this summation, based on if the entities corresponding startDate/entryDate
 * matches a field in totalRevObj.
 * @param {Array} entities DeliveredProcedures or Appointments
 * @param {String} dateType startDate or entryDate
 * @param {Object} totalRevObj object with dates and total revenue for set date
 * @param {String} entityField access delivered Procedure revenue or appointment estimatedRevenue
 * @param {String} timezone timezone of the office
 */
function sumEstimatedProcedureRevenue(entities, dateType, totalRevObj, entityField, timezone) {
  const endOfToday = endOfCurrentDay(timezone);
  const startOfToday = startOfCurrentDay(timezone);

  entities.forEach((entity) => {
    const date = moment
      .tz(entity[dateType], timezone)
      .endOf('day')
      .toISOString();

    // Seperating the summation for estimated revenue and billed revenue when the date matches today.
    if (endOfToday === date && dateType === 'entryDate') {
      totalRevObj[startOfToday] += entity[entityField];
    } else if (endOfToday === date && dateType === 'startDate') {
      totalRevObj[endOfToday] += entity[entityField];
    } else if (date in totalRevObj && date !== endOfToday) {
      totalRevObj[date] += entity[entityField];
    }
  });
}

const calculateAverage = dateObj =>
  Object.values(dateObj).reduce((acc, value, i, arr) => {
    const avg = value / arr.length;
    return acc + avg;
  }, 0);
