import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');
const Request = require('../../../models/Request');
const Practitioner = require('../../../models/Practitioner');



const subtractRange = (rangeArray, busyTime) => {
  if (_.isArray(rangeArray)) {
    const range = rangeArray.map((s) => {
      const contains = s.contains(busyTime);
      return contains ? s.subtract(busyTime) : s;
    });
    return _.flatten(range);
  }
  return rangeArray.subtract(busyTime)
}

const getFirstAvailableDate = (appointments, startDate, serviceDuration) => {

    const appointmentsByDate = appointments.filter(app => {
      return moment(app.startTime) >= moment(startDate);
    });

    let currentDay = startDate;
    const appointmentsLenght = appointmentsByDate.length;

    if (!appointmentsLenght) return moment({hour: 0, minutes: 0})._d
    currentDay = moment(appointmentsByDate[0].startTime)

    while(currentDay <= appointmentsByDate[appointmentsLenght -1].startTime) {
      const OFFICE_START_TIME = moment(currentDay).clone().set({ hours: 9, minutes: 0 }).toDate();
      const OFFICE_END_TIME = moment(currentDay).clone().set({ hours: 16, minutes: 30 }).toDate();

      const appointmentRanges = appointmentsByDate
        .filter(a => moment(a.startTime).startOf('day').isSame(moment(currentDay).startOf('day')))
        .map(appointment => moment.range(appointment.startTime, appointment.endTime));

      const dayRange = moment.range(OFFICE_START_TIME, OFFICE_END_TIME)

      let avaliableTimeRange = dayRange;

      appointmentRanges.forEach((appR) => {
        avaliableTimeRange = subtractRange(avaliableTimeRange, appR);
      });
      let isPractitionerBusy = true;
      avaliableTimeRange.forEach((r) => {
        const duration = Array.from(r.by('minutes')).length;
        if (serviceDuration <= duration) {
          isPractitionerBusy = false;
        }
      })

    if (isPractitionerBusy) {
      currentDay = moment(currentDay).add(1, 'days').startOf('day')._d
    } else {
      break;
    }
  }
    return  currentDay

}


availabilitiesRouter.get('/', (req, res, next) => {
  // const OFFICE_START_TIME = moment({ hours: 9, minutes: 0 });
  // const OFFICE_END_TIME = moment({ hours: 17, minutes: 0 });
  const { serviceId, practitionerId, startDate, endDate, retrieveFirstTime } = req.query;

  Practitioner.filter({ id: practitionerId }).getJoin().run()
    .then((stuff) => {
      Service.get(serviceId).run().then((service) => {
        // return res.send({ stuff: stuff[0] });
        const unsortedAppointments = stuff[0].appointment;
        const unsortedReservations = stuff[0].reservations;
        const unsortedRequests = stuff[0].requests;
        const appointments = unsortedAppointments
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const reservations = unsortedReservations
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const requests = unsortedRequests
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

          const startDateTopass = moment(startDate).clone().startOf('day')

          let firstAvailableDate = startDate;
          let endAvailableDateToShow = endDate;
          if (retrieveFirstTime) {
            firstAvailableDate = getFirstAvailableDate(appointments, startDateTopass, service.duration);
            endAvailableDateToShow = moment(firstAvailableDate).add(4, 'days')._d
            console.log(moment(firstAvailableDate).format('MMMM Do YYYY, h:mm:ss a'));
          }

          const requiredRange = moment.range(
            moment(firstAvailableDate).startOf('day'),
            moment(endAvailableDateToShow).endOf('day')
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


                const reservationRanges = reservations
                  .filter(r => moment(r.startTime).startOf('day').isSame(currentDay))
                  .map(reservation => moment.range(reservation.startTime, reservation.endTime));

                const requestRanges = requests
                  .filter(r => moment(r.startTime).startOf('day').isSame(currentDay))
                  .map(request => moment.range(request.startTime, request.endTime));

                const allRanges = reservationRanges.concat(appointmentRanges).concat(requestRanges);
                const hasAppointment = slotRange => _.some(allRanges, appointmentRange => {
                  return appointmentRange.overlaps(slotRange);
                });
                const availabilities = Array.from(dayRange.by('minutes', { step: 30 }))
                  .map(slot => ({
                    startsAt: slot.toDate(),
                    isBusy: hasAppointment(moment.range(slot, slot.clone().add(29, 'minutes'))),
                  }));

                return [
                  currentDay.format(),
                  { date: currentDay.format(), availabilities, practitionerId }
                ];
              })
          );

          res.send({ entities: { availabilities: results } });
      })

    })


/*  Service.get(serviceId).run().then((service) => {
    Appointment
      .filter({ practitionerId }).getJoin({ service: false }).orderBy('startTime').run()
      .then((appointments) => {
        Request.filter({ practitionerId }).orderBy('startTime').run()
        .then((requests) => {

        const startDateTopass = moment(startDate).clone().startOf('day')

        let firstAvailableDate = startDate;
        let endAvailableDateToShow = endDate;
        if (retrieveFirstTime) {
          firstAvailableDate = getFirstAvailableDate(appointments, startDateTopass, service.duration);
          endAvailableDateToShow = moment(firstAvailableDate).add(4, 'days')._d
          console.log(moment(firstAvailableDate).format('MMMM Do YYYY, h:mm:ss a'));
        }

        const requiredRange = moment.range(
          moment(firstAvailableDate).startOf('day'),
          moment(endAvailableDateToShow).endOf('day')
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
      })
      .catch(next); */
  .catch(next);
});

module.exports = availabilitiesRouter;
