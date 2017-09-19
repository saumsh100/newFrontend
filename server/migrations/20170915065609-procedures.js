'use strict';

const procedures = require('../fixtures/procedures/procedureDump.json');
const uuid = require('uuid').v4;

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

  down: function (queryInterface) {
    queryInterface.bulkDelete('DeliveredProcedures', null, {});
    return queryInterface.bulkDelete('Procedures', null, {});
  }
};
