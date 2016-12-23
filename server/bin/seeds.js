
const bcrypt = require('bcrypt');
const seedDatabase = require('../util/seedDatabase');
const uuid = require('uuid').v4

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

const accountId = uuid();
const justinPatientId = uuid();

const SEEDS = {
  Appointment: [
    {
      start: new Date(2016, 12, 26, 9, 30, 0, 0),
      end: new Date(2016, 12, 26, 12, 30, 0, 0),
      title: 'Crown Availability',
      id: uuid(),
      accountId: accountId,
      patientId: justinPatientId,
    },
    {
      start: new Date(2016, 12, 27, 14, 30, 0, 0),
      end: new Date(2016, 12, 27, 15, 30, 0, 0),
      title: 'Cavity Availability',
      id: uuid(),
      accountId: accountId,
      patientId: justinPatientId,
    },
    {
      start: new Date(2016, 12, 28, 9, 30, 0, 0),
      end: new Date(2016, 12, 28, 13, 30, 0, 0),
      title: 'Braces Availability',
      id: uuid(),
      accountId: accountId,
      patientId: justinPatientId,
    },
  ],
  
  User: [
    {
      username: 'lonny@carecru.com',
      password: bcrypt.hashSync('lonny', saltRounds),
      id: uuid(),
      activeAccountId: accountId,
    },
    {
      username: 'mark@carecru.com',
      password: bcrypt.hashSync('mark', saltRounds),
      id: uuid(),
      activeAccountId: accountId,
    },
    {
      username: 'justin@carecru.com',
      password: bcrypt.hashSync('justin', saltRounds),
      id: uuid(),
      activeAccountId: accountId,
    },
    {
      username: 'ashmeet@carecru.com',
      password: bcrypt.hashSync('ashmeet', saltRounds),
      id: uuid(),
      activeAccountId: accountId,
    },
    {
      username: 'sergey@carecru.com',
      password: bcrypt.hashSync('sergey', saltRounds),
      id: uuid(),
      activeAccountId: accountId,
    },
  ],
  
  Patient: [
    {
      firstName: 'Justin',
      lastName: 'Sharp',
      phoneNumber: '+17808508886',
      id: justinPatientId,
    },
    {
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      phoneNumber: '+17782422626',
      id: uuid(),
    },
    {
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: '+17788654451',
      id: uuid(),
    },
  ],

  Account: [
    {
      name: 'Beckett Dental',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      smsPhoneNumber: '+17786558613',
      id: accountId,
    }
  ]
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
