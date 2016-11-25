
const Availability = require('../models/Availability');

console.log('Seeding database...');

Availability.save([
  {
    start: new Date(2016, 10, 23, 9, 30, 0, 0),
    end: new Date(2016, 10, 23, 12, 30, 0, 0),
    title: 'Crown Availability',
  },
  {
    start: new Date(2016, 10, 23, 14, 30, 0, 0),
    end: new Date(2016, 10, 23, 15, 30, 0, 0),
    title: 'Cavity Availability',
  },
  {
    start: new Date(2016, 10, 24, 9, 30, 0, 0),
    end: new Date(2016, 10, 24, 13, 30, 0, 0),
    title: 'Braces Availability',
  },
]).then((result) => {
  console.log('Successfully seeded db with availabilities!');
  process.exit();
}).catch((err) => {
  console.error('ERROR! SEEDING DATABASE WITH AVAILABILITIES FAILED.');
  process.exit(err);
});
