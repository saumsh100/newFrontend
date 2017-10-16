import { Router } from 'express';
import moment from 'moment';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import format from '../../util/format';
const normalize = require('../normalize');
import { fetchAppointmentEvents } from '../../../lib/events/Appointments/';
import { fetchSentReminderEvents } from '../../../lib/events/SentReminders/';
import { fetchCallEvents } from '../../../lib/events/Calls/index';
import { Appointment, Patient, Call, SentReminder, Event } from '../../../_models';

const eventsRouter = Router();

eventsRouter.param('patientId', sequelizeLoader('patient', 'Patient'));

function filterEventsByQuery(eventsArray, query) {
  const {
    limit,
    skip,
  } = query;

  let filterArray = eventsArray;

  if (skip && eventsArray.length > skip) {
    filterArray = filterArray.slice(skip, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}

eventsRouter.get('/:patientId', async (req, res, next) => {
  try {
    const appointmentEvents = await fetchAppointmentEvents(req.patient.id);
    const callEvents = await fetchCallEvents(req.patient.id);
    const reminderEvents = await fetchSentReminderEvents(req.patient.id);

    const totalEvents = appointmentEvents.concat(callEvents, reminderEvents);
    const filteredEvents = filterEventsByQuery(totalEvents, req.query).sort((a, b) => {
      if (moment(b.createdAt).isBefore(moment(a.createdAt))) return -1;
      if (moment(b.createdAt).isAfter(moment(a.createdAt))) return 1;
      return 0;
    });

    const buildEvents = filteredEvents.map((event) => {
      const buildData = {
        patientId: req.patient.id,
        accountId: req.accountId,
      };

      if (event.hasOwnProperty('callSource')) {
        buildData.type = 'Call';
      } else if (event.hasOwnProperty('reminderId')) {
        buildData.type = 'Reminder';
      } else if (event.hasOwnProperty('serviceId')) {
        buildData.type = 'Appointment';
      }

      //const eventBuilt = await Event.build(buildData)
      return Event.build(buildData).dataValues;
    });


    res.send(normalize('events', buildEvents));
  } catch (error) {
    next(error);
  }
});

module.exports = eventsRouter;
