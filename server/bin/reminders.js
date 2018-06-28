
import moment from 'moment';
import globals from '../config/globals';
import jobQueue from '../config/jobQueue';
import EventsService from '../config/events';
import createSocketServer from '../sockets/createSocketServer';
import { computeRemindersAndSend } from '../lib/reminders';

global.io = createSocketServer();

// Set up pub in routes for pub subs
const pub = EventsService.socket('PUB', { routing: 'topic' });
pub.connect('events');

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('reminders', async (job, done) => {
  const { data: { date } } = job;
  try {
    const mDate = moment(date).seconds(0).milliseconds(0);
    const startDate = mDate.toISOString();
    const endDate = mDate.add(globals.reminders.cronIntervalMinutes, 'minutes').toISOString();
    await computeRemindersAndSend({ startDate, endDate, pub });
    done();
  } catch (err) {
    done(err);
  }
});
