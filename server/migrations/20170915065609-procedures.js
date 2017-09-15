'use strict';

const procedures = require('../fixtures/procedures/procedureDump.json');

module.exports = {
  up: async function (queryInterface) {
    return queryInterface.bulkInsert(
      'Procedures',
      procedures,
    );
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('Procedures', null, {});
  }
};
