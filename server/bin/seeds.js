
const bcrypt = require('bcrypt');
const seedDatabase = require('../util/seedDatabase');

// For hashing passwords for User seeds
// TODO: pull fromm global config, cause needs to be reused with deserialization
const saltRounds = 10;

/**
 * Seeds Map is organized by:
 *
 * {
 *    [TABLE_NAME1]: [ MODEL1_DATA, ],
 *    [TABLE_NAME2]: [ MODEL2_DATA, ],
 *    ...
 * }
 *
 */

const SEEDS = {
  Availability: [
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
  ],
  
  User: [
    {
      username: 'lonny@carecru.com',
      password: bcrypt.hashSync('lonny', saltRounds),
    },
    {
      username: 'mark@carecru.com',
      password: bcrypt.hashSync('mark', saltRounds),
    },
    {
      username: 'justin@carecru.com',
      password: bcrypt.hashSync('justin', saltRounds),
    },
    {
      username: 'ashmeet@carecru.com',
      password: bcrypt.hashSync('ashmeet', saltRounds),
    },
    {
      username: 'sergey@carecru.com',
      password: bcrypt.hashSync('sergey', saltRounds),
    },
  ],
  
  Patient: [
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
    {
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: '+17788654451',
    },
  ],
};

seedDatabase(SEEDS)
  .then(() => {
    console.log('Successfully executed bin/seeds.')
    process.exit();
  })
  .catch((err) => {
    console.error('Unsuccessfully executed bin/seeds.')
    console.error(err);
    process.exit(1);
  });

