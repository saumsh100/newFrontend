'use strict';

const _ = require('lodash');
const convertToCommsPreferences = require('../util/convertToCommsPreferences');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const [patients] = await queryInterface.sequelize
      .query(`
        SELECT "id", "contactMethodNote", "preferences" FROM "Patients"
        WHERE "contactMethodNote" IS NOT NULL;
      `);

    for (let i = 0; i < patients.length; i++) {
      const { id, preferences, contactMethodNote } = patients[i];
      const oldCommsPrefs = _.pick(preferences, ['sms', 'phone', 'emailNotifications']);
      const newCommsPrefs = convertToCommsPreferences(contactMethodNote);

      // Don't bother the query if they are the same
      if (_.isEqual(oldCommsPrefs, newCommsPrefs)) continue;

      const newPreferences = Object.assign({}, preferences, newCommsPrefs);
      await queryInterface.sequelize
        .query(`
          UPDATE "Patients"
          SET preferences = preferences || '${JSON.stringify(newPreferences)}'
          WHERE id = '${id}';
        `);
    }
  }
  ,

  down: function (queryInterface, Sequelize) {

  }
};
