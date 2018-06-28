
import jobQueue from '../config/jobQueue';
import EventsService from '../config/events';
import { computeRecallsAndSend } from '../lib/recalls';

// Create publish socket for RabbitMQ to pass over to recall sender
const publishSocket = EventsService.socket('PUB', { routing: 'topic' });
publishSocket.connect('events');

// We could use Heroku Scheduler for this but I have ever tested it - JSharp
jobQueue.process('recalls', async (job, done) => {
  const { data: { date } } = job;
  try {
    await computeRecallsAndSend({ date, publishSocket });
    done();
  } catch (err) {
    done(err);
  }
});
