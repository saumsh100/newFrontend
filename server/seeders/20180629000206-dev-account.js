
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

const timeWithZone = (hours, minutes, timezone) =>
  moment(new Date(1970, 1, 0, hours, minutes))
    .tz(timezone)
    .toDate();

const d2s = num => 60 * 60 * 24 * num;
const w2s = num => 60 * 60 * 24 * 7 * num;
const h2s = num => 60 * 60 * num;

const startTime = timeWithZone(8, 0, devTimezone);
const endTime = timeWithZone(17, 0, devTimezone);

const dailyScheduleTemplate = {
  startTime,
  endTime,
  createdAt: new Date(),
  updatedAt: new Date(),
  accountId: devAccountId,
};

const recallTemplate = {
  id: uuid(),
  accountId: devAccountId,
  primaryType: 'email',
  primaryTypes: ['email', 'sms'],
  lengthSeconds: w2s(4),
  interval: '1 months',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const reminderTemplate = {
  id: uuid(),
  accountId: devAccountId,
  primaryType: 'email',
  primaryTypes: ['email', 'sms'],
  lengthSeconds: d2s(21),
  interval: '21 days',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const serviceTemplate = {
  id: uuid(),
  accountId: devAccountId,
  bufferTime: 0,
  name: 'New Patient Consultation',
  duration: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const devAddress = [
  {
    id: devAddressId,
    street: '666 sample street',
    country: 'CA',
    state: 'BC',
    city: 'Vancouver',
    zipCode: 'V6J 0Z0',
    timezone: devTimezone,
    createdAt: '2017-08-04T00:14:30.932Z',
    updatedAt: '2017-08-04T00:14:30.932Z',
  },
];

const devEnterprise = [
  {
    id: devEnterpriseId,
    name: 'Dev Enterprise',
    createdAt: '2017-08-04T00:14:30.932Z',
    updatedAt: '2017-08-04T00:14:30.932Z',
    plan: 'ENTERPRISE',
  },
];

const devAccount = [
  {
    id: devAccountId,
    enterpriseId: devEnterpriseId,
    addressId: devAddressId,
    name: 'Dev Account',
    destinationPhoneNumber: '+16041111111',
    timeInterval: 30,
    website: 'carecru_dev.com',
    timezone: devTimezone,
    createdAt: '2017-08-04T00:14:30.932Z',
    updatedAt: '2017-08-04T00:14:30.932Z',
    canSendReviews: false,
  },
];

const devOwnerPermission = [
  {
    id: devOwnerPermissionId,
    role: 'OWNER',
    createdAt: '2017-08-04T00:14:30.932Z',
    updatedAt: '2017-08-04T00:14:30.932Z',
  },
];

const devUser = [
  {
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
  },
];

const devRecalls = [
  {
    ...recallTemplate,
    id: uuid(),
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(1),
    interval: '1 weeks',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-1),
    interval: '-1 weeks',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-4),
    interval: '-1 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-8),
    interval: '-2 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-12),
    interval: '-4 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-20),
    interval: '-6 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-28),
    interval: '-8 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-36),
    interval: '-10 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-44),
    interval: '-12 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-52),
    interval: '-14 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-60),
    interval: '-16 months',
  },
  {
    ...recallTemplate,
    id: uuid(),
    lengthSeconds: w2s(-68),
    interval: '-18 months',
  },
];

const devServices = [
  {
    ...serviceTemplate,
    id: uuid(),
  },
  {
    ...serviceTemplate,
    id: uuid(),
    name: 'Lost Filling',
  },
  {
    ...serviceTemplate,
    id: uuid(),
    name: 'Emergency Appointment',
  },
  {
    ...serviceTemplate,
    id: uuid(),
    name: 'Regular Checkup & Cleaning',
  },
  {
    ...serviceTemplate,
    id: uuid(),
    name: 'Regular Consultation',
  },
  {
    ...serviceTemplate,
    id: uuid(),
    name: 'Child Dental Exam',
  },
];

const devReminders = [
  {
    ...reminderTemplate,
    id: uuid(),
  },
  {
    ...reminderTemplate,
    id: uuid(),
    lengthSeconds: d2s(7),
    interval: '7 days',
  },
  {
    ...reminderTemplate,
    id: uuid(),
    lengthSeconds: d2s(2),
    interval: '2 days',
  },
  {
    ...reminderTemplate,
    id: uuid(),
    lengthSeconds: h2s(2),
    interval: '2 hours',
  },
];

const mondayId = uuid();
const tuesdayId = uuid();
const wednesdayId = uuid();
const thursdayId = uuid();
const fridayId = uuid();
const saturdayId = uuid();
const sundayId = uuid();

const devDailySchedules = [
  {
    ...dailyScheduleTemplate,
    id: mondayId,
  },
  {
    ...dailyScheduleTemplate,
    id: tuesdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: wednesdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: thursdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: fridayId,
  },
  {
    ...dailyScheduleTemplate,
    id: saturdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: sundayId,
  },
];

const devWeeklySchedule = [
  {
    id: devWeeklyScheduleId,
    createdAt: '2017-08-04T00:14:30.932Z',
    updatedAt: '2017-08-04T00:14:30.932Z',
    mondayId,
    tuesdayId,
    wednesdayId,
    thursdayId,
    fridayId,
    saturdayId,
    sundayId,
    accountId: devAccountId,
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Enterprises', devEnterprise);

    await queryInterface.bulkInsert('Addresses', devAddress);

    await queryInterface.bulkInsert('Accounts', devAccount);

    await queryInterface.bulkInsert('DailySchedules', devDailySchedules);

    await queryInterface.bulkInsert('WeeklySchedules', devWeeklySchedule);

    await queryInterface.sequelize.query(`UPDATE "Accounts" SET "weeklyScheduleId" = '${devWeeklyScheduleId}' WHERE "id" = '${devAccountId}';`);

    await queryInterface.bulkInsert('Reminders', devReminders);

    await queryInterface.bulkInsert('Services', devServices);

    await queryInterface.bulkInsert('Recalls', devRecalls);

    await queryInterface.bulkInsert('Permissions', devOwnerPermission);

    await queryInterface.bulkInsert('Users', devUser);
  },

  down() {},
};
