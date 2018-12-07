'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.sequelize.query(`UPDATE "Patients"
          SET preferences = jsonb_set(preferences, '{recalls}', 'true', true)`, { transaction: t });

        await queryInterface.sequelize.query(`UPDATE "Patients"
          SET preferences = jsonb_set(preferences, '{reviews}', 'true', true)`, { transaction: t });

        await queryInterface.sequelize.query(`UPDATE "Patients"
          SET preferences = jsonb_set(preferences, '{referrals}', 'true', true)`, { transaction: t });

        await queryInterface.sequelize.query('ALTER TABLE "Patients" ALTER COLUMN preferences SET DEFAULT' +
          "'{" +
              '"sms": true,' +
              '"phone": true,' +
              '"evening": true,' +
              '"morning": true,' +
              '"weekdays": true,' +
              '"weekends": true,' +
              '"afternoon": true,' +
              '"reminders": true,' +
              '"newsletter": true,' +
              '"birthdayMessage": true,' +
              '"emailNotifications": true,' +
              '"recalls": true,' +
              '"reviews": true,' +
              '"referrals": true' +
            "}'::jsonb", { transaction: t });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  },
};
