
import moment from 'moment';
import { Appointment, DeliveredProcedure, WeeklySchedule, Account, sequelize } from '../../_models';

export async function calcRevenueDays(accountId, startDate, endDate) {
  try {
    const accountData = await Account.findOne({
      where: {
        id: accountId,
      },
      include: [{
        model: WeeklySchedule,
        as: 'weeklySchedule',
      }],
      nest: true,
      raw: true,
    });

    const date = moment(endDate).endOf('day');
    const days = date.diff(moment(startDate).startOf('day'), 'days');

    const weeklySchedule = accountData.weeklySchedule;

    const {   // Dates that are before/after/between the current day
      datesAfter,
      datesBefore,
      dateBetween,
      totalRevObj,
    } = generateRevenueDates(weeklySchedule, date, days);

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
          startDate: {
            $between: [sDateAfter.startOf('day').toISOString(), eDateAfter.endOf('day').toISOString()],
          },
          estimatedRevenue: {
            $not: null,
          },
        },
      });

      sumEstimatedProcedureRevenue(appointments, 'startDate', totalRevObj, 'estimatedRevenue');
    }

    if (datesBefore.length) {
      const sDateBefore = datesBefore[datesBefore.length - 1];
      const eDateBefore = datesBefore[0];

      const deliveredProc = await DeliveredProcedure.findAll({
        raw: true,
        where: {
          accountId,
          entryDate: {
            $between: [sDateBefore.startOf('day').toISOString(), eDateBefore.endOf('day').toISOString()],
          },
          isCompleted: true,
        },
        group: ['DeliveredProcedure.id'],
        attributes: [
          'DeliveredProcedure.entryDate',
          [sequelize.fn('sum', sequelize.col('totalAmount')), 'totalRevenue'],
        ],
      });

      sumEstimatedProcedureRevenue(deliveredProc, 'entryDate', totalRevObj);
    }

    if (dateBetween.length) {
      const delProc = await DeliveredProcedure.findAll({
        raw: true,
        where: {
          accountId,
          entryDate: {
            $between: [moment().startOf('day').toISOString(), moment().toISOString()],
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
          startDate: {
            $between: [moment().toISOString(), moment().endOf('day').toISOString()],
          },
          estimatedRevenue: {
            $not: null,
          },
        },
      });

      sumEstimatedProcedureRevenue(delProc, 'entryDate', totalRevObj);

      sumEstimatedProcedureRevenue(apps, 'startDate', totalRevObj, 'estimatedRevenue');
    }

    totalRevObj.average = calculateAverage(totalRevObj);

    return totalRevObj;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


function generateRevenueDates(weeklySchedule, date, numOfDays) {
  const datesBefore = [];
  const datesAfter = [];
  const dateBetween = [];
  const totalRevObj = {};

  let numOfDates = 0;
  let i = 0;

  while (numOfDates < numOfDays) {
    let subDate = moment(date).subtract(i, 'days');

    let isClosed = isClinicClosed(weeklySchedule, subDate);
    let j = i;

    while (isClosed) {
      j += 1;
      subDate = moment(date).subtract(j, 'days');
      isClosed = isClinicClosed(weeklySchedule, subDate);
    }

    i = j + 1;

    const isBefore = subDate.isBefore(moment());
    const isBetween = (subDate.isBetween(moment().startOf('day'), moment().endOf('day')) ||
      subDate.isSame(moment().endOf('day')));

    const isAfter = subDate.isAfter(moment());

    if (isBefore && !isBetween) {
      datesBefore.push(subDate);
    }

    if (isAfter && !isBetween) {
      datesAfter.push(subDate);
    }

    if (isBetween) {
      dateBetween.push(subDate);
    }

    totalRevObj[subDate.toISOString()] = 0;
    numOfDates += 1;
  }

  return {
    totalRevObj,
    datesAfter,
    datesBefore,
    dateBetween,
  };
}

function isClinicClosed(weeklySchedule, date) {
  const dayofWeek = date.format('dddd').toLowerCase();
  return weeklySchedule[dayofWeek].isClosed;
}


function calculateAverage(dateObj) {
  const entries = Object.keys(dateObj);

  let total = 0;

  entries.forEach((entry) => {
    total += dateObj[entry];
  });

  return total / (entries.length);
}


function sumEstimatedProcedureRevenue(entities, dateType, totalRevObj, entityField = 'totalRevenue') {
  entities.map((entity) => {
    const date = moment(entity[dateType]).endOf('day').toISOString();
    if (date in totalRevObj) {
      totalRevObj[date] += entity[entityField];
    }
  });
}
