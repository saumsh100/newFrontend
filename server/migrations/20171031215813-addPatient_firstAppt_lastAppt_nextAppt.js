
'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'firstApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'nextApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, DataTypes) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'firstApptId', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastApptId', { transaction: t });
        await queryInterface.removeColumn('Patients', 'nextApptId', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
