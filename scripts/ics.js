
import moment from 'moment';
import ics, { buildAppointmentEvent } from '../server/lib/ics';

const sampleEvent = {
  // Date Format is very important here ex.// '2017-05-20 10:30'
  start: moment(new Date(2017, 5, 20, 7, 50)).format('gggg-MM-DD kk:mm'),
  end: moment(new Date(2017, 5, 20, 7, 50)).format('gggg-MM-DD kk:mm'),
  title: 'CARECRU TEST EVENT',
  description: 'Annual 10-kilometer run in Boulder, Colorado',
  location: 'Folsom Field, University of Colorado (finish line)',
  url: 'http://www.bolderboulder.com/',
  status: 'confirmed',
  geo: { lat: 40.0095, lon: 105.2669 },
  attendees: [
    { name: 'Adam Gibbons', email: 'adam@example.com' },
    { name: 'Brittany Seaton', email: 'brittany@example2.org' },
  ],
  categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
  alarms:[
    { action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' },
    { action: 'AUDIO', trigger: '-PT30M' },
  ],
};

const sampleData = {
  appointment: {
    startDate: new Date(201),
  },

  patient: {

  },

  account: {
    website: 'https://beckettdental.com',
  },
};

console.log('Contents should match');
console.log(ics.buildEvent(sampleEvent));
ics.createEvent(sampleEvent, () => console.log('document finished'));
