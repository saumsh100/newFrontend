
'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'PatientUsers',
          'insuranceCarrier',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );
        await queryInterface.addColumn(
          'PatientUsers',
          'insuranceMemberId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );
        await queryInterface.addColumn(
          'PatientUsers',
          'insuranceGroupId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('PatientUsers', 'insuranceCarrier', { transaction: t });
        await queryInterface.removeColumn('PatientUsers', 'insuranceMemberId', { transaction: t });
        await queryInterface.removeColumn('PatientUsers', 'insuranceGroupId', { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
