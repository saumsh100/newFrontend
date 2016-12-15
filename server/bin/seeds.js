const bcrypt = require('bcrypt');
const Availability = require('../models/Availability');
const User = require('../models/User');
const saltRounds = 10;
const users = [
  {username: 'lonny@carecru.com', password: 'lonny'},
  {username: 'mark@carecru.com', password: 'mark'},
  {username: 'justin@carecru.com', password: 'justin'},
  {username: 'ashmeet@carecru.com', password: 'ashmeet'},
  {username: 'sergey@carecru.com', password: 'sergey'}
]

console.log('Seeding database...');

const availability = Availability.save([
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
  // process.exit();
}).catch((err) => {
  console.error('ERROR! SEEDING DATABASE WITH AVAILABILITIES FAILED.');
  // process.exit(err);
});

const hashedUsers = users.map(({username, password}) => {
  return {
    username,
    password: bcrypt.hashSync(password, saltRounds)
  }
})



const user = User.save(hashedUsers).then((result) => {
  console.log('Successfully seeded db with users!');
  // process.exit();
}).catch((err) => {
  console.error('ERROR! SEEDING DATABASE WITH AVAILABILITIES FAILED.');
  // process.exit(err);
});

Promise.all([availability, user])
  .then(() => (process.exit()))
  .catch(() => (process.exit()))
