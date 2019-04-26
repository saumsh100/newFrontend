
const uuid = require('uuid').v4;

const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '72954241-3652-4792-bae5-5bfed53d37b7';
const serviceId = '52fb9349-7bd1-454f-a501-e1eda02b3b86';
const practitionerIds = [
  '19b851d4-5730-41ad-8b85-b3c5f2ee91ff',
  '96eadc09-4c70-4259-9534-c7e112e3b2d6',
  '4c8f5a0b-4a50-4ea1-af22-46362c14833b',
  '714b1556-a077-4cd6-8f7b-aadf0bd163d1',
  '6ecc3d1d-2d8c-4763-baac-f7e3c0c203d5',
  '12594869-c80b-43bb-8e2b-eeae7aead5e0',
  '0200e115-edbd-45f0-a907-8c40fff357e2',
  'f334b97f-21ec-42ad-828e-599bf4c99b1d',
  '69281845-f523-4848-8368-159fb575bd7d',
  'f059e1cd-5593-46ec-90b6-af14dd9c974e',
];

module.exports = {
  up: async function (queryInterface) {
    const services = [
      {
        id: serviceId,
        accountId: accountId2,
        name: 'Local Test Service',
        duration: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        name: 'Local Test Service',
        duration: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const practitionerServices = practitionerIds.map((practitionerId) => ({
      id: uuid(),
      practitionerId,
      serviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Services', services);
    await queryInterface.bulkInsert('Practitioner_Services', practitionerServices);
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
