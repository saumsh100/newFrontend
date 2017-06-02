
import sendReminder from '../server/lib/reminders/sendReminder';

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

sendReminder.email(sampleData)
  .then((call) => {
    console.log('call.sid', call.sid);
  }).catch((err) => {
    console.log(err);
    throw err;
  });


