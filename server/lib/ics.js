
import ICS from 'ics';
import moment from 'moment-timezone';

const ics = new ICS();

export default ics;

export function buildAppointmentEvent({ appointment, patient, account }) {
  const {
    startDate,
    endDate,
  } = appointment;

  const {
    name,
    timezone,
  } = account;

  return ics.buildEvent({
    // Date Format is very important here ex.// '2017-05-20 10:30'
    start: moment.tz(startDate, timezone).format('gggg-MM-DD kk:mm'),
    end: moment.tz(endDate, timezone).format('gggg-MM-DD kk:mm'),
    title: `${name} Appointment`,
    description: `Appointment at ${name}`,
    // location: account.buildAddress(),
    url: account.website,
    status: 'confirmed',
    // geo: { lat: 40.0095, lon: 105.2669 },
    categories: ['health', 'dental'],
    alarms: [
      { action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' },
      { action: 'AUDIO', trigger: '-PT30M' },
    ],
  });
}
