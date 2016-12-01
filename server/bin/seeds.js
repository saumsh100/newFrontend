
const thinky = require('../config/thinky');
const r = thinky.r;
const Availability = require('../models/Availability');
const Patient = require('../models/Patient');

console.log('Wiping tables...');

Availability.run().then(results => results.forEach(result => result.delete()));
Patient.run().then(results => results.forEach(result => result.delete()));

console.log('Tables wiped!');
console.log('Now seeding a fresh database...');

Availability.save([
  {
    start: new Date(2016, 11, 2, 9, 30, 0, 0),
    end: new Date(2016, 11, 2, 12, 30, 0, 0),
    title: 'Crown Availability',
  },
  {
    start: new Date(2016, 11, 2, 14, 30, 0, 0),
    end: new Date(2016, 11, 2, 15, 30, 0, 0),
    title: 'Cavity Availability',
  },
  {
    start: new Date(2016, 11, 3, 9, 30, 0, 0),
    end: new Date(2016, 11, 3, 13, 30, 0, 0),
    title: 'Braces Availability',
  },
]).then((result) => {
  console.log('Successfully seeded db with availabilities!');
  //process.exit();
}).catch((err) => {
  console.error('ERROR! SEEDING DATABASE WITH AVAILABILITIES FAILED.');
  console.error(err);
  process.exit(1);
});

Patient.save([
  {
    firstName: 'Justin',
    lastName: 'Sharp',
    phoneNumber: '+17808508886',
  },
  {
    firstName: 'Sergey',
    lastName: 'Skovorodnikov',
    phoneNumber: '+17782422626',
  },
]).then((result) => {
  console.log('Successfully seeded db with patients!');
  //process.exit();
}).catch((err) => {
  console.error('ERROR! SEEDING DATABASE WITH PATIENTS FAILED.');
  console.error(err);
  process.exit(1);
});
