import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');



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
  const { serviceId, practitionerId, startDate, endDate } = req.query;

  Service.get(serviceId).run().then((service) => {
    Appointment
      .filter({ practitionerId }).getJoin({ service: false }).orderBy('startTime').run()
      .then((appointments) => {


        const startDateTopass = moment(startDate).clone().startOf('day')
        const firstAvailableDate = getFirstAvailableDate(appointments, startDateTopass, service.duration);
        console.log("firstAvailableDate");
        console.log(moment(firstAvailableDate).format('MMMM Do YYYY, h:mm:ss a'));

        const endAvailableDateToShow = moment(firstAvailableDate).add(4, 'days')._d
        // new code
        const requiredRange = moment.range(
          moment(firstAvailableDate).startOf('day'),
          moment(endAvailableDateToShow).endOf('day')
        );
        
        // old code
        /*const requiredRange = moment.range(
          moment(startDate).startOf('day'),
          moment(endDate).endOf('day')
        );*/


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
  }).catch(next);
});

module.exports = availabilitiesRouter;
