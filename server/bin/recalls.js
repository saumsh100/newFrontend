
import rabbitjs from 'rabbit.js';
import jobQueue from '../config/jobQueue';
import { computeRecallsAndSend } from '../lib/recalls';

const globals = require('../config/globals');

// Create publish socket for RabbitMQ to pass over to recall sender
const context = rabbitjs.createContext(globals.rabbit);
const publishSocket = context.socket('PUB', { routing: 'topic' });
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
