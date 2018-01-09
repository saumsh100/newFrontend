
import rabbitjs from 'rabbit.js';
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { computeRecallsAndSend } from '../lib/recalls';
import connectorWatch from '../lib/connectorWatch';

const globals = require('../config/globals');

global.io = createSocketServer();

// Create publish socket for RabbitMQ to pass over to recall sender
const context = rabbitjs.createContext(globals.rabbit);
const publishSocket = context.socket('PUB', { routing: 'topic' });
publishSocket.connect('events');

// We could use Heroku Scheduler for this but I have ever tested it - JSharp
jobQueue.process('recalls', async (job, done) => {
  const { data: { date } } = job;
  try {
    await computeRecallsAndSend({ date, publishSocket });
    // putting connector down email cron here as it's not intensive enough
    // to warrant a seperate cron
    await connectorWatch(global.io);
    done();
  } catch (err) {
    done(err);
  }
});
