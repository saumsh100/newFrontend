
import moment from 'moment';
import EventsService from '../config/events';
import { computeReviewsAndSend } from '../lib/reviews';

const pub = EventsService.socket('PUB', { routing: 'topic' });
pub.connect('events');

const run = async () => {
  console.log(JSON.stringify(process.argv, null, 2));

  const argStartDate = new Date(process.argv[2]);

  const date = moment(argStartDate).seconds(0).milliseconds(0).toISOString();

  await computeReviewsAndSend({
    date,
    pub,
  });
};

run().then(() => process.exit(0));
