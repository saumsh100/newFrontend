const bcrypt = require('bcrypt');

const passwordHashSaltRounds = 10;

const devEnterpriseId = 'fb4322b9-0eb2-4af2-a087-7661dd5bad24';
const devAddressId = '49270d09-340c-460e-9fdb-4445f114a292';
const devAccountId = '19deb187-5873-4bb7-ba4d-fea0a57d1b93';
const devOwnerPermissionId = '0486edfc-7e4f-464f-8fe7-a38bb6a37a53';
const devUserId = 'f55ea49b-5cb2-40b8-a3b8-53f90742e252';
const devWeeklyScheduleId = 'ef85ef48-0521-4d3d-83cd-8f7ebcb398ee';

const devAddress = {
  id: devAddressId,
  street: '666 sample street',
  country: 'CA',
  state: 'BC',
  city: 'Vancouver',
  zipCode: 'V6J 0Z0',
  timezone: 'America/Vancouver',
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
  website: 'carecru_dev.com',
  timezone: 'America/Vancouver',
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

const devWeeklySchedule = {
  id: devWeeklyScheduleId,
  createdAt: '2017-08-04T00:14:30.932Z',
  updatedAt: '2017-08-04T00:14:30.932Z',
};

module.exports = {

  up: async function (queryInterface) {
    await queryInterface.bulkInsert('Enterprises', [devEnterprise]);

    await queryInterface.bulkInsert('WeeklySchedules', [devWeeklySchedule]);

    await queryInterface.bulkInsert('Addresses', [devAddress]);

    await queryInterface.bulkInsert('Accounts', [devAccount]);

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
