import moment from 'moment';
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');

availabilitiesRouter.get('/', (req, res, next) => {
  const OFFICE_START_TIME = moment({ hours: 9, minutes: 0 });
  const OFFICE_END_TIME = moment({ hours: 17, minutes: 0 });
  const { serviceId, practitionerId, startDate } = req.query;
  const startDateDay = moment(startDate).date();

  Service.get(serviceId).execute().then((service) => {
    Appointment
      .filter({ practitionerId }).getJoin().orderBy('startTime').run()
      .then((appointments) => {
        const filteredByDayApps = appointments.filter(a =>
          startDateDay === moment(a.startTime).date()
        );
        if (appointments.length === 0) {
          return res.send([{
            startTime: OFFICE_START_TIME,
            endTime: OFFICE_END_TIME,
          }]);
        }
        const breaks = [];
        let startTime = OFFICE_START_TIME;
        // let lastAppointmentEndTime = null;
        breaks.push({
          startTime: OFFICE_START_TIME,
          endTime: moment(filteredByDayApps[0].startTime),
        });
        for (let i = 0; i < filteredByDayApps.length - 1; i += 1) {
          startTime = moment(filteredByDayApps[i].endTime);
          breaks.push({
            startTime,
            endTime: moment(filteredByDayApps[i + 1].startTime),
          });
        }

        breaks.push({
          startTime: filteredByDayApps[filteredByDayApps.length - 1].endTime,
          endTime: OFFICE_END_TIME,
        });

        const availabilities = breaks.filter(b =>
          moment(b.endTime).diff(moment(b.startTime), 'minutes') >= service.duration
        );

        return res.send(availabilities);
      })
      .catch(next);
  });
});

module.exports = availabilitiesRouter;
