
import rabbitjs from 'rabbit.js';
import globals from '../config/globals';
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { computeReviewsAndSend } from '../lib/reviews';

global.io = createSocketServer();

// Set up pub in routes for pub subs
const context = rabbitjs.createContext(globals.rabbit);

const pub = context.socket('PUB', { routing: 'topic' });
pub.connect('events');

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('reviews', async (job, done) => {
  const { data: { date } } = job;

  try {
    await computeReviewsAndSend({ date, pub });
    done();
  } catch (err) {
    done(err);
  }
});
