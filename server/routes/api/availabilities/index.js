import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);
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
        const requiredRange = moment.range(
          moment(startDate).startOf('day'),
          moment(endDate).endOf('day')
        );
        const results = _.fromPairs(
          Array.from(requiredRange.by('day'))
            .map(currentDay => {
              // next two lines should be taken from Practitioner working time
              // not just hard hardcoded
              const OFFICE_START_TIME = currentDay.clone().set({ hours: 9, minutes: 0 }).toDate();
              const OFFICE_END_TIME = currentDay.clone().set({ hours: 16, minutes: 30 }).toDate();

              const dayRange = moment.range(OFFICE_START_TIME, OFFICE_END_TIME)

              const appointmentRanges = appointments
                .filter(a => moment(a.startTime).startOf('day').isSame(currentDay))
                .map(appointment => moment.range(appointment.startTime, appointment.endTime));

              console.log(appointmentRanges);

              const hasAppointment = slotRange => _.some(appointmentRanges, appointmentRange => {
                return appointmentRange.intersect(slotRange);
              });


              const availabilities = Array.from(dayRange.by('minutes', { step: 30 }))
                .map(slot => ({
                  startsAt: slot.toDate(),
                  isBusy: hasAppointment(moment.range(slot, slot.add(29, 'minutes'))),
                }));

              return [
                currentDay.format(),
                { date: currentDay.format(), availabilities, practitionerId }
              ];
            })
        );

        res.send({ entities: { availabilities: results } });
      })
      .catch(next);
  }).catch(next);
});

module.exports = availabilitiesRouter;
