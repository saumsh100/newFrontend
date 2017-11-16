'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
         'Correspondences',
         'method',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );

        await queryInterface.addColumn(
          'Correspondences',
          'sentReminderId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'SentReminders',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t }
        );

        await queryInterface.addColumn(
          'Correspondences',
          'sentRecallId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'SentRecalls',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t }
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Correspondences', 'method', { transaction: t });
        await queryInterface.removeColumn('Correspondences', 'sentReminderId', { transaction: t });
        await queryInterface.removeColumn('Correspondences', 'sentRecallId', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
