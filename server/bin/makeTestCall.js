
import { dateFormatter } from '@carecru/isomorphic';
import { stringify } from 'query-string';
import { twilio } from '../config/globals';
import twilioClient from '../config/twilio';

const run = async () => {
  if (!process.argv[2] || process.argv[2] === 'help') {
    console.log(`
    Usage
      $ foo npm run run:test:calls -- number binIWantToTest APIurl
  
    Examples
      $ npm run run:test:calls -- "+199999" "https://my.bin.url" "https://my.confirmation.url"
    `);

    return;
  }

  console.log(JSON.stringify('args', process.argv, null, 2));

  const now = new Date(Date.now()).toISOString();
  const practiceName = 'Test Practice';
  const to = process.argv[2];
  const bin = process.argv[3];
  const confirmAppointmentEndpoint = process.argv[4];

  const startDate = dateFormatter(now, 'America/Vancouver', 'MMMM Do');
  const startTime = dateFormatter(now, 'America/Vancouver', 'h:mma');

  const opts = {
    practiceName,
    startDateTime: `${startDate} at ${startTime}`,
    practiceNumber: twilio.phoneNumber,
    confirmAppointmentEndpoint,
  };

  const query = stringify(opts);
  const url = `${bin}?${query}`;

  console.log('opts', JSON.stringify(opts, null, 2));
  console.log('URL:', url);

  try {
    const call = await twilioClient.calls.create({
      to,
      from: opts.practiceNumber,
      url,
      timeout: '15',
    });

    console.log(call.sid);
  } catch (e) {
    console.error(e);
  }
};

run().then(() => process.exit(0));
