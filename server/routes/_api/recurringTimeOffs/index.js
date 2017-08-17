import moment from 'moment-timezone';
import { sequelizeLoader } from '../../util/loaders';
import { PractitionerRecurringTimeOff, Account, Practitioner, WeeklySchedule } from '../../../_models';

const union = require('lodash/union');
const recurringTimeOffRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');


recurringTimeOffRouter.param('timeOffId', sequelizeLoader('recurringTimeOff', 'PractitionerRecurringTimeOff'));


/**
 * Create a timeOff
 */
recurringTimeOffRouter.post('/', checkPermissions('timeOffs:create'), (req, res, next) => {
  return PractitionerRecurringTimeOff.create(req.body)
    .then((tf) => {
      return res.status(201).send(normalize('practitionerRecurringTimeOff', tf.get({ plain: true })))
    })
    .catch(next);
});

/**
 * Create a timeOff from PMS
 */
recurringTimeOffRouter.post('/pms', checkPermissions('timeOffs:create'), (req, res, next) => {
  const data = req.body;
  const recurringTimeoffs = [];
  const chairs = {};

  for (let i = 0; i < data.length; i++) {
    const {
      scheduleJson,
      endDate,
      practitionerId,
      isWorking,
      chairIds,
      notes,
    } = data[i];

    const schedule = JSON.parse(scheduleJson);

    const {
      PatternStartDate,
      StartTime,
      PatternEndDate,
      EndTime,
      interval = 1,
      DayOfWeek,
      DayOfMonth,
      MonthOfYear,
      RecurrenceEndMode,
      Id,
    } = schedule.RecurrencePattern;

    if (!DayOfWeek && (!DayOfMonth || !MonthOfYear)) {
      continue;
    }

    const newDayOfWeek = DayOfWeek || moment(`${moment().get('year')} ${DayOfMonth} ${MonthOfYear}`, 'YYYY-MM-DD').format('dddd');

    if (isWorking) {
      if (practitionerId && DayOfWeek && (RecurrenceEndMode || moment(endDate).isAfter(moment('99900620', 'YYYYMMDD').toISOString()))) {
        const dayOfWeek = newDayOfWeek.toLowerCase().replace(/\s/g, '').split(',');

        if (!chairs[practitionerId]) {
          chairs[practitionerId] = [];
        }

        for (let i = 0; i < dayOfWeek.length; i++) {
          chairs[practitionerId].push({
            Id,
            practitionerId,
            chairIds,
            dayOfWeek: dayOfWeek[i],
          });
        }
      }
    } else {
      const dayOfWeek = newDayOfWeek.replace(/\s/g, '').split(',');

      for (let i = 0; i < dayOfWeek.length; i++) {
        recurringTimeoffs.push({
          practitionerId,
          PatternStartDate,
          StartTime,
          PatternEndDate,
          EndTime,
          interval,
          DayOfWeek: dayOfWeek[i],
          endDate,
          notes,
        });
      }
    }
  }

  return Account.findOne({ where: { id: req.accountId }, raw: true })
  .then((account) => {

    const allPromises = [];
    Object.keys(chairs).map((practitionerId) => {
      const newChairIds = {};
      const ids = {};

      for (let i = 0; i < chairs[practitionerId].length; i++) {
        const dayOfWeek = chairs[practitionerId][i].dayOfWeek;

        if (!newChairIds[dayOfWeek]) {
          newChairIds[dayOfWeek] = [];
        }

        newChairIds[dayOfWeek] = union(newChairIds[dayOfWeek], chairs[practitionerId][i].chairIds);
        ids[dayOfWeek] = chairs[practitionerId][i].Id;
      }

      allPromises.push(Practitioner.findOne({ where: { id: practitionerId }, raw: true })
      .then((prac) => {
        console.log(prac)
        return WeeklySchedule.findOne({ where: { id: prac.weeklyScheduleId }, raw: true })
        .then((weeklySchedule) => {
          Object.keys(newChairIds).map((day) => {
            weeklySchedule[day].chairIds = newChairIds[day];
            weeklySchedule[day].pmsScheduleId = ids[day];
          });
          return WeeklySchedule.update(weeklySchedule, { where: { id: prac.weeklyScheduleId } });
        });
      }));
    });

    const deleteTimeOffs = Object.keys(recurringTimeoffs).map((allData) => {
      return PractitionerRecurringTimeOff.destroy({
        where: {
          practitionerId: allData.practitionerId,
        },
      });
    });

    return Promise.all(deleteTimeOffs)
    .then(() => {

      const waitForAll = [];

      recurringTimeoffs.map((allData) => {
        const {
          practitionerId,
          PatternStartDate,
          PatternEndDate,
          StartTime,
          EndTime,
          interval,
          DayOfWeek,
          endDate,
          notes,
        } = allData;

        const test = moment.tz(PatternEndDate + EndTime, 'MM/DD/YYYY 00:00:00HH:mm:ss', account.timezone);
        const isInfinity = moment.tz(endDate, account.timezone).subtract(1, 'days');

        const end = test.isBefore(isInfinity.toISOString()) ? isInfinity : test;
        const start = moment.tz(PatternStartDate + StartTime, 'MM/DD/YYYY 00:00:00HH:mm:ss', account.timezone);

        const startTime = new Date(1970, 1, 0, start.hours(), start.minutes(), start.seconds());
        const endTime = new Date(1970, 1, 0, test.hours(), test.minutes(), test.seconds());

        waitForAll.push(PractitionerRecurringTimeOff.create({
          fromPMS: true,
          dayOfWeek: DayOfWeek,
          note: notes,
          allDay: false,
          interval,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          practitionerId,
        }));
      });

      return Promise.all(waitForAll);
    }).then(() => res.sendStatus(200));
  })
  .catch(next);
});


/**
 * Update a timeOff
 */
recurringTimeOffRouter.put('/:timeOffId', checkPermissions('timeOffs:update'), (req, res, next) =>{
  return req.recurringTimeOff.update(req.body)
    .then(tf => res.send(normalize('practitionerRecurringTimeOff', tf.get({ plain: true }))))
    .catch(next);
});

/**
 * Delete a timeOff
 */
recurringTimeOffRouter.delete('/:timeOffId', checkPermissions('timeOffs:delete'), (req, res, next) => {
  return req.recurringTimeOff.destroy()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = recurringTimeOffRouter;
