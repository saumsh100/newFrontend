
import moment from 'moment';
import EventsService from '../config/events';
import { computeRemindersAndSend } from '../lib/reminders';

const pub = EventsService.socket('PUB', { routing: 'topic' });
pub.connect('events');

const run = async () => {
  console.log(JSON.stringify(process.argv, null, 2));

  const argStartDate = new Date(process.argv[2]);
  const argEndDate = new Date(process.argv[3]);

  const startDate = moment(argStartDate).seconds(0).milliseconds(0).toISOString();
  const endDate = moment(argEndDate).seconds(0).milliseconds(0).toISOString();
  
  await computeRemindersAndSend({
    startDate,
    endDate,
    pub,
  });
};

run().then(() => process.exit(0));
