'use strict';

const procedures = require('../fixtures/procedures/procedureDumpV2.json');

module.exports = {
  up: async function (queryInterface) {
    const syncProcedures = procedures.map((procedure) => {
      return Object.assign({}, procedure, {
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return queryInterface.bulkInsert(
      'Procedures',
      syncProcedures,
    );
  },

  down: async function (queryInterface) {
    await queryInterface.bulkDelete('DeliveredProcedures', null, {});
    return queryInterface.bulkDelete('Procedures', null, {});
  }
};
