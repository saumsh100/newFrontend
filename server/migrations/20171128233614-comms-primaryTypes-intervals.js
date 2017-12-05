
'use strict';

const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        // TODO: needs to add allowNull AFTER the row gets the value
        await queryInterface.addColumn(
          'Recalls',
          'primaryTypes',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            // allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'primaryTypes',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            // allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Recalls',
          'interval',
          {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'interval',
          {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          { transaction: t },
        );

        /*await queryInterface.removeColumn(
          'Recalls',
          'primaryType',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'primaryType',
          { transaction: t },
        );*/

        // TODO: Perhaps we also flag this as isDeleted to we can create now Recalls
        // Now change current Recalls lengthSeconds to be 1week post-dueDate (-604800 seconds)
        // await queryInterface.sequelize.query(`UPDATE "Recalls" SET "lengthSeconds" = -604800;`, { transaction: t });

        // Now change current SentRecalls lengthSeconds to match new Recalls lengthSeconds
        // await queryInterface.sequelize.query(`UPDATE "SentRecalls" SET "lengthSeconds" = -604800;`, { transaction: t });
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Recalls',
          'primaryTypes',
          { transaction: t }
        );

        await queryInterface.removeColumn(
          'Reminders',
          'primaryTypes',
          { transaction: t }
        );

        await queryInterface.removeColumn(
          'Recalls',
          'interval',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'interval',
          { transaction: t },
        );

        /*await queryInterface.addColumn(
          'Recalls',
          'primaryType',
          {
            type: Sequelize.ENUM,
            values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
            allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'primaryType',
          {
            type: Sequelize.ENUM,
            values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
            allowNull: false,
          },
          { transaction: t },
        );*/
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  }
};
