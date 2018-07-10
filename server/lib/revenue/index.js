import moment from 'moment-timezone';
import { Appointment, DeliveredProcedure, WeeklySchedule, Account, sequelize } from '../../_models';

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
    const weeklySchedule = accountData.weeklySchedule;
    const dateTimezone = moment.tz(date, timezone).toISOString();

    const closedDates = getClosedClinicDates(weeklySchedule, dateTimezone, pastDaysLimit, timezone);

    // If the chosen date correspondes with a date the office is closed it will return no revenue.
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
      dateTimezone,
      closedDates,
      pastDaysLimit,
      maxDates,
      accountId,
      timezone,
    );

    const { datesAfter, datesBefore, dateBetween } = getBeforeAfterTodayDates(
      totalRevObj,
      timezone,
    );

    if (datesBefore.length) {
      const sDateBefore = datesBefore[datesBefore.length - 1];
      const eDateBefore = datesBefore[0];

      const deliveredProc = await DeliveredProcedure.findAll({
        raw: true,
        where: {
          accountId,
          entryDate: {
            $between: [
              moment(sDateBefore)
                .startOf('day')
                .toISOString(),
              moment(eDateBefore)
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

    if (datesAfter.length) {
      const sDateAfter = datesAfter[datesAfter.length - 1];
      const eDateAfter = datesAfter[0];

      const appointments = await Appointment.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isMissed: false,
          isPending: false,
          isDeleted: false,
          startDate: {
            $between: [moment(sDateAfter).toISOString(), moment(eDateAfter).toISOString()],
          },
          estimatedRevenue: {
            $not: null,
          },
        },
      });

      sumEstimatedProcedureRevenue(
        appointments,
        'startDate',
        totalRevObj,
        'estimatedRevenue',
        timezone,
      );
    }

    if (dateBetween.length) {
      const currentDate = moment()
        .tz(timezone)
        .toISOString();

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
              currentDate,
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
          isMissed: false,
          isPending: false,
          isDeleted: false,
          startDate: {
            $between: [
              currentDate,
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
              moment(selectedDate)
                .subtract(dateRangeInt, 'days')
                .toISOString(),
              moment(selectedDate)
                .endOf('day')
                .toISOString(),
            ],
          },
        },
      ],
      isMissed: false,
      isPending: false,
      isCancelled: false,
      isDeleted: false,
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
    const currentTime = moment().tz(timezone);

    const isBefore = subDate.isBefore(currentTime);

    const isBetween =
      subDate.isBetween(currentTime.startOf('day'), currentTime.endOf('day')) ||
      subDate.isSame(currentTime.endOf('day'));

    const isAfter = subDate.isAfter(currentTime);

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
  return entities.forEach((entity) => {
    const endOfDay = moment
      .tz(entity[dateType], timezone)
      .endOf('day')
      .toISOString();
    if (endOfDay in totalRevObj) {
      totalRevObj[endOfDay] += entity[entityField];
    }
  });
}

const calculateAverage = dateObj =>
  Object.values(dateObj).reduce((acc, value, i, arr) => {
    const avg = value / arr.length;
    return acc + avg;
  }, 0);
