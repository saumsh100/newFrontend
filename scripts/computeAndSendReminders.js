
import { computeRemindersAndSend } from '../server/lib/reminders';

const sampleData = {
  appointment: {
    startDate: new Date(2017, 6, 1, 8, 0),
    endDate: new Date(2017, 6, 1, 10, 0),
  },

  patient: {
    firstName: 'Justin',
    email: 'justin.d.sharp@gmail.com',
  },

  account: {
    name: 'Donna Dental',
    phoneNumber: '+17808508886',
    website: 'http://donnadental.com',
  },
};

function delay(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

async function main() {
  try {
    await computeRemindersAndSend({ date: (new Date().toISOString()) });
    /*const arr = [1, 2, 3];
    for (const i of arr) {
      console.log('before', i);
      await delay(100);
      console.log('after', i);
    }*/

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
