
import sendRecall from '../server/lib/recalls/sendRecall';

const sampleData = {
  lastAppointment: {
    startDate: new Date(2017, 1, 1, 8, 0),
    endDate: new Date(2017, 1, 1, 10, 0),
  },

  patient: {
    firstName: 'Justin',
    email: 'justin.d.sharp@gmail.com',
    mobilePhoneNumber: '+16048557738',
  },

  account: {
    name: 'Donna Dental',
    // phoneNumber: '+17808508886',
    twilioPhoneNumber: '+17786558613',
    website: 'http://donnadental.com',
  },
};

sendRecall.email(sampleData)
  .then((data) => {
    console.log('success');
    console.log('data', data);
  }).catch((err) => {
    console.error('error!');
    console.error(err);
    throw err;
  });
