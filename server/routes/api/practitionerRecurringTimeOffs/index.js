import moment from 'moment-timezone';

const union = require('lodash/union');
const recurringTimeOffRouter = require('express').Router();
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const RecurringTimeOff = require('../../../models/PractitionerRecurringTimeOff');
const Account = require('../../../models/Account');
const Practitioner = require('../../../models/Practitioner');
const WeeklySchedule = require('../../../models/WeeklySchedule');


recurringTimeOffRouter.param('timeOffId', loaders('recurringTimeOff', 'PractitionerRecurringTimeOff'));

/**
 * Get all practitioner time offs under a clinic
 */
recurringTimeOffRouter.get('/', checkPermissions('timeOffs:read'), (req, res, next) => {

  // There is no joinData for timeoffs
  return RecurringTimeOff.run()
    .then(timeOffs => res.send(normalize('practitionerRecurringTimeOffs', timeOffs)))
    .catch(next);
});


/**
 * Create a timeOff
 */
recurringTimeOffRouter.post('/', checkPermissions('timeOffs:create'), (req, res, next) => {
  return RecurringTimeOff.save(req.body)
    .then((tf) => {
      return res.status(201).send(normalize('practitionerRecurringTimeOff', tf))
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
      Id,
    } = schedule.RecurrencePattern;

    if (!DayOfWeek && (!DayOfMonth || !MonthOfYear)) {
      continue;
    }

    const newDayOfWeek = DayOfWeek || moment(`${moment().get('year')} ${DayOfMonth} ${MonthOfYear}`, 'YYYY-MM-DD').format('dddd');

    if (isWorking) {
      if (practitionerId && DayOfWeek && moment(endDate).isAfter(moment('99900620', 'YYYYMMDD').toISOString())) {
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

  return Account.get(req.accountId).run()
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

      allPromises.push(Practitioner.get(practitionerId).getJoin({ weeklySchedule: true })
      .then((prac) => {
        return WeeklySchedule.get(prac.weeklySchedule.id)
        .then((weeklySchedule) => {
          Object.keys(newChairIds).map((day) => {
            weeklySchedule[day].chairIds = newChairIds[day];
            weeklySchedule[day].pmsScheduleId = ids[day];
          });

          return weeklySchedule.save();
        });
      }));
    });

    const deleteTimeOffs = Object.keys(recurringTimeoffs).map((allData) => {
      return RecurringTimeOff
      .filter(r.row('fromPMS').eq(true))
      .filter({ practitionerId: allData.practitionerId })
      .run()
      .then((timeOffs) => {
        const promises = [];
        for (let i = 0; i < timeOffs.length; i++) {
          promises.push(timeOffs[i].delete());
        }
        return Promise.all(promises);
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

        waitForAll.push(RecurringTimeOff.save({
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
  return req.recurringTimeOff.merge(req.body).save()
    .then(tf => res.send(normalize('practitionerRecurringTimeOff', tf)))
    .catch(next);
});

/**
 * Delete a timeOff
 */
recurringTimeOffRouter.delete('/:timeOffId', checkPermissions('timeOffs:delete'), (req, res, next) => {
  req.recurringTimeOff.delete()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = recurringTimeOffRouter;
