'use strict';

Practitioner.belongsToMany(Service, {
  through: {
    model: 'Practitioner_Service',
    unique: false,
  },
  constraints: false,
  as: 'services',
  foreignKey: 'practitionerId',
});

Service.belongsToMany(Practitioner, {
  through: {
    model: 'Practitioner_Service',
    unique: false,
  },
  constraints: false,
  as: 'practitioners',
  foreignKey: 'serviceId',
});

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
