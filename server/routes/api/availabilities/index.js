
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');
const Request = require('../../../models/Request');
const Practitioner = require('../../../models/Practitioner');
const Account = require('../../../models/Account');



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

const getFirstAvailableDate = (appointments, startDate, serviceDuration, officeStartTime, officeEndTime) => {

    const appointmentsByDate = appointments.filter(app => {
      return moment(app.startTime) >= moment(startDate);
    });

    let currentDay = startDate;
    const appointmentsLenght = appointmentsByDate.length;

    if (!appointmentsLenght) return moment({hour: 0, minutes: 0})._d
    currentDay = moment(appointmentsByDate[0].startTime)

    while(currentDay <= appointmentsByDate[appointmentsLenght -1].startTime) {
      const OFFICE_START_TIME = moment(currentDay).clone().set(officeStartTime).toDate();
      const OFFICE_END_TIME = moment(currentDay).clone().set(officeEndTime).toDate();

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
  const appointmentJoin = {
    appointments: {
      _apply: function (sequence) {
        return sequence.orderBy('startTime');
      },
    },
    reservations: {
      _apply: function (sequence) {
        return sequence.orderBy('startTime');
      },
    },
    requests: {
      _apply: function (sequence) {
        return sequence.orderBy('startTime');
      },
    },
  };

  Practitioner.filter({ id: practitionerId }).getJoin(appointmentJoin).run()
    .then((stuff) => {
      Account.get(stuff[0].accountId).getJoin({ weeklySchedule: true }).run().then(account => {
        Service.get(serviceId).run().then((service) => {
          const { appointments, reservations, requests } = stuff[0];
          const startDateTopass = moment(startDate).clone().startOf('day')
          let firstAvailableDate = startDate;
          let endAvailableDateToShow = endDate;
          // retrieve dayoffs form the db
          const { weeklySchedule } = account;
          const closedDays = Object.keys(weeklySchedule)
          .filter(k => (typeof weeklySchedule[k] == "object" && weeklySchedule[k].isClosed === true))

          const daySchedule = weeklySchedule[moment(firstAvailableDate)._d.toLocaleString('en-us', { weekday: 'long' }).toLowerCase() ];
          const { startTime, endTime } = daySchedule;

          // TODO: should be "if startDate is not defined"
          if (retrieveFirstTime) {
            // if this is invoded for the first time - calculate the fisrt available day of selected practitoner
            firstAvailableDate = getFirstAvailableDate(appointments, startDateTopass, service.duration, startTime, endTime);
            endAvailableDateToShow = moment(firstAvailableDate).add(4, 'days')._d
            console.log(moment(firstAvailableDate).format('MMMM Do YYYY, h:mm:ss a'));
          }

          const requiredRange = moment.range(
            moment(firstAvailableDate).startOf('day'),
            moment(endAvailableDateToShow).endOf('day')
          );


          // get all availabilities
          const results = _.fromPairs(
            Array.from(requiredRange.by('day'))
              .map(currentDay => {
                //retrieve OFFICE_START_TIME OFFICE_END_TIME
                const dayName =  currentDay._d.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
                const daySchedule = weeklySchedule[dayName];
                const { startTime, endTime } = daySchedule;

                const sTime = { hours: startTime.h, minutes: startTime.m };
                const eTime = { hours: endTime.h, minutes: endTime.m };
                const OFFICE_START_TIME = currentDay.clone().set(sTime).toDate();
                const OFFICE_END_TIME = currentDay.clone().set(eTime).toDate();
                const dayRange = moment.range(OFFICE_START_TIME, OFFICE_END_TIME)

                //create time ranges for appointments reservations and requests
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

                // express a function that check is given time overlaps with given range
                const hasAppointment = slotRange => _.some(allRanges, appointmentRange => {
                  return appointmentRange.overlaps(slotRange);
                });


                //split all day 30minutes ranges and check every for overlaping with all ranges
                const availabilities = Array.from(dayRange.by('minutes', { step: 30 }))
                  .map(slot => ({
                    startsAt: slot.toDate(),
                    isBusy: hasAppointment(moment.range(slot, slot.clone().add(29, 'minutes')))
                    || closedDays.indexOf(slot.toDate().toLocaleString('en-us', { weekday: 'long' }).toLowerCase()) > -1,

                  }));

                return [
                  currentDay.format(),
                  { date: currentDay.format(), availabilities, practitionerId }
                ];
              })
          );

            res.send({ entities: { availabilities: results } });
        })
      });
    })

  .catch(next);
});

module.exports = availabilitiesRouter;
