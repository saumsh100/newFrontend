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

    const timeZone = accountData.timezone || 'America/Vancouver';

    const selectedDate = moment
      .tz(date, timeZone)
      .endOf('day')
      .toISOString();
    const dateRangeInt = pastDaysLimit;

    const weeklySchedule = accountData.weeklySchedule;

    const closedDates = getClosedClinicDates(weeklySchedule, selectedDate, dateRangeInt, timeZone);

    if (
      closedDates.indexOf(moment
        .tz(date, timeZone)
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
      timeZone,
    );

    const { datesAfter, datesBefore, dateBetween } = getBeforeAfterTodayDates(
      totalRevObj,
      timeZone,
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
                .tz(sDateAfter, timeZone)
                .startOf('day')
                .toISOString(),
              moment
                .tz(eDateAfter, timeZone)
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
        timeZone,
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
                .tz(sDateBefore, timeZone)
                .startOf('day')
                .toISOString(),
              moment
                .tz(eDateBefore, timeZone)
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
        timeZone,
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
                .tz(timeZone)
                .startOf('day')
                .toISOString(),
              moment()
                .tz(timeZone)
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
          startDate: {
            $between: [
              moment()
                .tz(timeZone)
                .toISOString(),
              moment()
                .tz(timeZone)
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

      sumEstimatedProcedureRevenue(delProc, 'entryDate', totalRevObj, 'totalRevenue', timeZone);

      sumEstimatedProcedureRevenue(apps, 'startDate', totalRevObj, 'estimatedRevenue', timeZone);
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

function getClosedClinicDates(weeklySchedule, date, numOfDays, timeZone) {
  const closedDates = [];
  let i = 0;

  while (i < numOfDays) {
    const subDate = moment.tz(date, timeZone).subtract(i, 'days');

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
  timeZone,
) {
  const appointments = await Appointment.findAll({
    where: {
      accountId,
      $and: [
        {
          startDate: {
            $between: [
              moment
                .tz(selectedDate, timeZone)
                .subtract(dateRangeInt, 'days')
                .toISOString(),
              moment
                .tz(selectedDate, timeZone)
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
      .tz(app.startDate, timeZone)
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
function getBeforeAfterTodayDates(dateObj, timeZone) {
  const datesBefore = [];
  const datesAfter = [];
  const dateBetween = [];

  const dateObjKeys = Object.keys(dateObj);

  dateObjKeys.forEach((date) => {
    const subDate = moment.tz(date, timeZone);
    const isBefore = subDate.isBefore(moment().tz(timeZone));
    const isBetween =
      subDate.isBetween(
        moment()
          .tz(timeZone)
          .startOf('day'),
        moment()
          .tz(timeZone)
          .endOf('day'),
      ) ||
      subDate.isSame(moment()
        .tz(timeZone)
        .endOf('day'));

    const isAfter = subDate.isAfter(moment().tz(timeZone));

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
function sumEstimatedProcedureRevenue(entities, dateType, totalRevObj, entityField, timeZone) {
  entities.forEach((entity) => {
    const date = moment
      .tz(entity[dateType], timeZone)
      .endOf('day')
      .toISOString();
    if (date in totalRevObj) {
      totalRevObj[date] += entity[entityField];
    }
  });
}

const calculateAverage = dateObj =>
  Object.values(dateObj).reduce((acc, value, i, arr) => {
    const avg = value / arr.length;
    return acc + avg;
  }, 0);
