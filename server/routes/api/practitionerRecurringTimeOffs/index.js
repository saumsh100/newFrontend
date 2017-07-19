import moment from 'moment-timezone';

const recurringTimeOffRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const TimeOff = require('../../../models/PractitionerRecurringTimeOff');
const Account = require('../../../models/Account');


recurringTimeOffRouter.param('timeOffId', loaders('recurringTimeOff', 'PractitionerRecurringTimeOff'));

/**
 * Get all practitioner time offs under a clinic
 */
recurringTimeOffRouter.get('/', checkPermissions('timeOffs:read'), (req, res, next) => {

  // There is no joinData for timeoffs
  return TimeOff.run()
    .then(timeOffs => res.send(normalize('practitionerRecurringTimeOffs', timeOffs)))
    .catch(next);
});


/**
 * Create a timeOff
 */
recurringTimeOffRouter.post('/', checkPermissions('timeOffs:create'), (req, res, next) => {
  return TimeOff.save(req.body)
    .then((tf) => {
      return res.status(201).send(normalize('practitionerRecurringTimeOff', tf))
    })
    .catch(next);
});

/**
 * Create a timeOff from PMS
 */
recurringTimeOffRouter.post('/pms', checkPermissions('timeOffs:create'), (req, res, next) => {
  const {
    xmlString,
    endDate,
    practitionerId,
    isWorking,
    note,
  } = req.body;

  const {
    PatternStartDate,
    StartTime,
    PatternEndDate,
    EndTime,
    interval = 1,
    DayOfWeek,
  } = xmlString.RecurrencePattern;

  return Account.get(req.body.accountId).run()
  .then((account) => {
    if (!isWorking) {
      const test = moment.tz(PatternEndDate + EndTime, 'MM/DD/YYYY 00:00:00HH:mm:ss', account.timezone);
      const isInfinity = moment.tz(endDate, 'MM/DD/YYYY HH:mm:ss', account.timezone);
      const end = test.isBefore(isInfinity.toISOString()) ? isInfinity : test;
      const start = moment.tz(PatternStartDate + StartTime, 'MM/DD/YYYY 00:00:00HH:mm:ss', account.timezone);

      const startTime = new Date(1970, 1, 0, start.hours(), start.minutes(), start.seconds());
      const endTime = new Date(1970, 1, 0, test.hours(), test.minutes(), test.seconds());

      return TimeOff.save({
        fromPMS: true,
        dayOfWeek: DayOfWeek,
        note,
        allDay: false,
        interval,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        practitionerId,
      })
      .then(() => {
        return res.sendStatus(200);
      });
    }

    return res.sendStatus(200);
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
