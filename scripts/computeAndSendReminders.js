
import { Account } from '../server/_models';
import { seedTestAccountsSequelize, accountId } from '../tests/util/seedTestAccounts';
import { computeRemindersAndSend } from '../server/lib/_reminders';

const sampleData = {
  appointment: {
    startDate: new Date(2017, 6, 1, 8, 0),
    endDate: new Date(2017, 6, 1, 10, 0),
  },

  /*patient: {
    firstName: 'Justin',
    email: 'justin.d.sharp@gmail.com',
  },*/

  patient: {
    firstName: 'Jatinder',
    email: 'dhillon.jatinder@gmail.com',
    mobilePhoneNumber: '16048076210',
  },

  account: {
    name: 'Donna Dental',
    phoneNumber: '+17808508886',
    website: 'http://donnadental.com',
  },
};

// TODO: test this when we can actually create reminder data through dashboard

async function main() {
  try {
    await computeRemindersAndSend({ date: (new Date().toISOString()) });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
