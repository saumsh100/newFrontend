
import moment from 'moment';
import {
  Account,
  SentReminder,
} from '../server/_models';
import { computeRemindersAndSend } from '../server/lib/reminders';

async function main() {
  try {
    await SentReminder.destroy({
      where: {},
      force: true,
    });

    const startDate = process.env.REMINDERS_DATE;
    const endDate = moment(startDate).add(5, 'minutes').toISOString();
    await computeRemindersAndSend({ startDate, endDate });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
