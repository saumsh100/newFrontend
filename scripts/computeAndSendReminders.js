
import { Account } from '../server/_models';
// import { seedTestAccountsSequelize, accountId } from '../tests/util/seedTestAccounts';
import { computeRemindersAndSend } from '../server/lib/reminders';

async function main() {
  try {
    await computeRemindersAndSend({ date: process.env.REMINDERS_DATE });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
