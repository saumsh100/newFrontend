import moment from 'moment';
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');

availabilitiesRouter.get('/', (req, res, next) => {
  // const OFFICE_START_TIME = moment({ hours: 9, minutes: 0 });
  // const OFFICE_END_TIME = moment({ hours: 17, minutes: 0 });
  const { serviceId, practitionerId, startDate, endDate } = req.query;

  Service.get(serviceId).run().then((service) => {
    Appointment
      .filter({ practitionerId }).getJoin({ service: false }).orderBy('startTime').run()
      .then((appointments) => {
        const results = {};
        const diff = moment(endDate).diff(moment(startDate), 'days') + 1;
        console.log(diff);
        for (let j = 0; j < diff; j += 1) {
          const startDateDay = moment(startDate).add({ days: j });
          const theStartTime = moment(startDate).add({ days: j }).format();
          // next two lines should be taken from Practitioner working time
          // not just hard hardcoded
          const OFFICE_START_TIME = startDateDay.set({ hours: 9, minutes: 0 }).toDate();
          const OFFICE_END_TIME = startDateDay.set({ hours: 17, minutes: 0 }).toDate();
          const filteredByDayApps = appointments.filter(a =>
            moment(a.startTime).isSame(startDateDay, 'd') &&
            moment(a.startTime).isSame(startDateDay, 'year') &&
            moment(a.startTime).isSame(startDateDay, 'month')
          );

          if (filteredByDayApps.length) {
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

            const availableTimeRanges = breaks.filter(b =>
              moment(b.endTime).diff(moment(b.startTime), 'minutes') >= service.duration
            );

            const availabilities = [];
            availableTimeRanges.forEach((a) => {
              for (let i = moment(a.startTime); moment(a.endTime) - i > 0; i = moment(i).add({
                minutes: service.duration,
              })) {
                availabilities.push(i);
              }
            });


            results[theStartTime] = {
              date: theStartTime,
              availabilities,
            };
          }
        }
        const resultStructure = {
          entities: { availabilities: results },
        };
        res.send(resultStructure);
      })
      .catch(next);
  }).catch(next);
});

module.exports = availabilitiesRouter;
