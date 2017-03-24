
const moment = require('moment');
const { type, r } = require('../config/thinky');
const createModel = require('./createModel');
const Account = require('./Account');
const WeeklySchedule = require('./WeeklySchedule');

const Practitioner = createModel('Practitioner', {
  accountId: type.string().uuid(4).required(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  pmsId: type.string(),
  type: type.string(),

  // If false we use Clinic's sechedule as default
  isCustomSchedule: type.boolean().default(false),
  weeklyScheduleId: type.string().uuid(4),
});

/**
 * getWeeklySchedule will fetch the appropriate weeklySchedule
 * based if it is custom or if it should inherit the clinic's office hours
 */
Practitioner.define('getWeeklySchedule', function () {
  const self = this;
  return new Promise((resolve, reject) => {
    if (self.isCustomSchedule) {
      WeeklySchedule.get(self.weeklyScheduleId).then(ws => resolve(ws));
    } else {
      Account.get(self.accountId).getJoin({ weeklySchedule: true })
        .then((account) => {
          return resolve(account.weeklySchedule);
        });
    }
  });
});

/**
 *
 */
Practitioner.define('getTimeOff', function (startDate, endDate) {
  const self = this;
  return new Promise((resolve, reject) => {
    return Practitioner.get(self.id).getJoin({
      timeOff: {
        _apply: (sequence) => {
          return sequence
            .filter((t) => {
              return t('startDate').during(startDate, endDate).or(
                t('endDate').during(startDate, endDate)
              );
            });
        },
      },
    }).then(p => resolve(p.timeOff));
  });
});

/**
 *
 */
Practitioner.define('getAvailableTimeIntervals', function (startDate, endDate) {
  const self = this;
  return new Promise((resolve, reject) => {
    self.getWeeklySchedule()
      .then((weeklySchedule) => {



      });
  });
});


module.exports = Practitioner;
