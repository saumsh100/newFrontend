
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;

const accountId = '72954241-3652-4792-bae5-5bfed53d37b7';
const patientId1 = '63854241-3652-4792-bae5-5bfed53d37b7';
const patientId2 = '54454241-3652-4792-bae5-5bfed53d37b7';

const families = [
  {
    id: uuid(),
    accountId,
    headId: patientId1,
    createdAt: new Date(2017, 1, 1),
    updatedAt: new Date(2017, 1, 1),
  },
  {
    id: uuid(),
    accountId,
    headId: patientId2,
    createdAt: new Date(2018, 1, 1),
    updatedAt: new Date(2018, 1, 1),
  },
];

const patients = [
  {
    id: uuid(),
    accountId,
    firstName: 'Lauren',
    lastName: 'Kyle',
    email: `justin+other@carecru.com`,
    mobilePhoneNumber: '+17808508886',
    familyId: families[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Families', families);
    await queryInterface.sequelize.query(`
      update "Patients"
      set "familyId" = '${families[0].id}'
      where "id" = '${patientId1}';
    `);
    await queryInterface.sequelize.query(`
      update "Patients"
      set "familyId" = '${families[1].id}'
      where "id" = '${patientId2}';
    `);
    await queryInterface.bulkInsert('Patients', patients);
  },

  down() {
  },
};
