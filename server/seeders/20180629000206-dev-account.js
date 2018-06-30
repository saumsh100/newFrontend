
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');

const passwordHashSaltRounds = 10;

const devEnterpriseId = 'fb4322b9-0eb2-4af2-a087-7661dd5bad24';
const devAddressId = '49270d09-340c-460e-9fdb-4445f114a292';
const devAccountId = '19deb187-5873-4bb7-ba4d-fea0a57d1b93';
const devOwnerPermissionId = '0486edfc-7e4f-464f-8fe7-a38bb6a37a53';
const devUserId = 'f55ea49b-5cb2-40b8-a3b8-53f90742e252';
const devWeeklyScheduleId = 'ef85ef48-0521-4d3d-83cd-8f7ebcb398ee';
const devTimezone = 'America/Vancouver';

const timeWithZone = (hours, minutes, timezone) => {
  const now = moment(new Date(Date.UTC(1970, 1, 0, hours, minutes)));
  const another = now.clone();
  another.tz(timezone);
  now.add(-1 * another.utcOffset(), 'minutes');
  return now.toDate();
};

const d2s = num => 60 * 60 * 24 * num;
const w2s = num => 60 * 60 * 24 * 7 * num;
const h2s = num => 60 * 60 * num;

const startTime = timeWithZone(8, 0, devTimezone);
const endTime = timeWithZone(17, 0, devTimezone);
const breakStartTime = timeWithZone(12, 0, devTimezone);
const breakEndTime = timeWithZone(13, 0, devTimezone);

const defaultDailySchedule = JSON.stringify({
  startTime,
  endTime,
  breaks: [{
    startTime: breakStartTime,
    endTime: breakEndTime,
  }],
});

const devAddress = {
  id: devAddressId,
  street: '666 sample street',
  country: 'CA',
  state: 'BC',
  city: 'Vancouver',
  zipCode: 'V6J 0Z0',
  timezone: devTimezone,
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
};

const devEnterprise = {
  id: devEnterpriseId,
  name: 'Dev Enterprise',
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
  plan: 'ENTERPRISE',
};

const devAccount = {
  id: devAccountId,
  enterpriseId: devEnterpriseId,
  weeklyScheduleId: devWeeklyScheduleId,
  addressId: devAddressId,
  name: 'Dev Account',
  destinationPhoneNumber: '+16041111111',
  timeInterval: 30,
  website: 'carecru_dev.com',
  timezone: devTimezone,
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
  canSendReviews: false,
};

const devOwnerPermission = {
  id: devOwnerPermissionId,
  role: 'OWNER',
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
};

const devUser = {
  id: devUserId,
  enterpriseId: devEnterpriseId,
  activeAccountId: devAccountId,
  permissionId: devOwnerPermissionId,
  username: 'dev@carecru.com',
  password: bcrypt.hashSync('asdzxcqwe', passwordHashSaltRounds),
  firstName: 'dev',
  lastName: 'carecru',
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
};

const devRecalls = [
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(4),
    interval: '1 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(1),
    interval: '1 weeks',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-1),
    interval: '-1 weeks',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-4),
    interval: '-1 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-8),
    interval: '-2 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-12),
    interval: '-4 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-20),
    interval: '-6 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-28),
    interval: '-8 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-36),
    interval: '-10 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-44),
    interval: '-12 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-52),
    interval: '-14 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-60),
    interval: '-16 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-68),
    interval: '-18 months',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const devServices = [
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'New Patient Consultation',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'Lost Filling',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'Emergency Appointment',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'Regular Checkup & Cleaning',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'Regular Consultation',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    bufferTime: 0,
    name: 'Child Dental Exam',
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const devReminders = [
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(21),
    interval: '21 days',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(7),
    interval: '7 days',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(2),
    interval: '2 days',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    accountId: devAccountId,
    primaryType: 'email',
    primaryTypes: ['email', 'sms'],
    lengthSeconds: h2s(2),
    interval: '2 hours',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const devWeeklySchedule = {
  id: devWeeklyScheduleId,
  monday: defaultDailySchedule,
  tuesday: defaultDailySchedule,
  wednesday: defaultDailySchedule,
  thursday: defaultDailySchedule,
  friday: defaultDailySchedule,
  saturday: defaultDailySchedule,
  sunday: defaultDailySchedule,
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
};

module.exports = {

  async up(queryInterface) {
    await queryInterface.bulkInsert('Enterprises', [devEnterprise]);

    await queryInterface.bulkInsert('Addresses', [devAddress]);

    await queryInterface.bulkInsert('WeeklySchedules', [devWeeklySchedule]);

    await queryInterface.bulkInsert('Accounts', [devAccount]);

    await queryInterface.bulkInsert('Reminders', devReminders);

    await queryInterface.bulkInsert('Services', devServices);

    await queryInterface.bulkInsert('Recalls', devRecalls);

    await queryInterface.bulkInsert('Permissions', [devOwnerPermission]);

    await queryInterface.bulkInsert('Users', [devUser]);
  },

  down: function (queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
