'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        // Add isActive column to Recalls
        await queryInterface.addColumn(
          'Recalls',
          'isActive',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
          },
          { transaction: t },
        );

        // Add isActive column to Reminders
        await queryInterface.addColumn(
          'Reminders',
          'isActive',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
          },
          { transaction: t },
        );

        // Add isActive column to Recalls
        await queryInterface.addColumn(
          'Recalls',
          'isDeleted',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        );

        // Add isActive column to Reminders
        await queryInterface.addColumn(
          'Reminders',
          'isDeleted',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        );

        // Add dueDateSeconds column to Patients, overrides Account's value
        await queryInterface.addColumn(
          'Patients',
          'recallDueDateSeconds',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        );

        // Add dueDateSeconds column to Accounts
        await queryInterface.addColumn(
          'Accounts',
          'recallDueDateSeconds',
          {
            type: Sequelize.INTEGER,

            // 6 months
            defaultValue: 15552000,
            allowNull: false,
          },
          { transaction: t },
        );

        // TODO: Perhaps we also flag this as isDeleted to we can create now Recalls
        // Now change current Recalls lengthSeconds to be 1week post-dueDate (-604800 seconds)
        await queryInterface.sequelize.query(`UPDATE "Recalls" SET "lengthSeconds" = -604800;`, { transaction: t });

        // Now change current SentRecalls lengthSeconds to match new Recalls lengthSeconds
        await queryInterface.sequelize.query(`UPDATE "SentRecalls" SET "lengthSeconds" = -604800;`, { transaction: t });
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        // Remove isActive column to Recalls
        await queryInterface.removeColumn(
          'Recalls',
          'isActive',
          { transaction: t }
        );

        // Remove isActive column to Reminders
        await queryInterface.removeColumn(
          'Reminders',
          'isActive',
          { transaction: t }
        );

        // Remove isActive column to Recalls
        await queryInterface.removeColumn(
          'Recalls',
          'isDeleted',
          { transaction: t }
        );

        // Remove isActive column to Reminders
        await queryInterface.removeColumn(
          'Reminders',
          'isDeleted',
          { transaction: t }
        );

        // Remove dueDateSeconds column to Patients
        await queryInterface.removeColumn(
          'Patients',
          'recallDueDateSeconds',
          { transaction: t }
        );

        // Remove dueDateSeconds column to Accounts
        await queryInterface.removeColumn(
          'Accounts',
          'recallDueDateSeconds',
          { transaction: t }
        );

        // Change back to what it was before
        await queryInterface.sequelize.query(`UPDATE "Recalls" SET "lengthSeconds" = 15552000;`, { transaction: t });

        // Change back to what it was before
        await queryInterface.sequelize.query(`UPDATE "SentRecalls" SET "lengthSeconds" = 15552000;`, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  }
};
