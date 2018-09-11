
'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeConstraint(
          'Correspondences',
          'correspondence_type_sentReminderId_unique',
        );
        await queryInterface.addConstraint(
          'Correspondences',
          [
            'type',
            'sentReminderId',
            'patientId',
            'appointmentId',
          ],
          {
            type: 'unique',
            name: 'correspondence_type_sentReminderId_patientId_unique',
          },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeConstraint(
          'Correspondences',
          'correspondence_type_sentReminderId_patientId_unique',
        );
        await queryInterface.addConstraint(
          'Correspondences',
          ['type', 'sentReminderId'],
          {
            type: 'unique',
            name: 'correspondence_type_sentReminderId_unique',
          },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
