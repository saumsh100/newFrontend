
'use strict';

const { v4: uuid } = require('uuid');
const { host } = require('../config/globals');

const newConfigurationName = 'API_HOSTNAME';

/**
 * Default value of this property is the host on which the application is running.
 * This value absolutely needs to exist similar to ADAPTER_TYPE. Since we have
 * two distinct environments (US and CA) we can default to the hostname property
 * of each environment to set this.
 */
module.exports = {

  up: async queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.bulkInsert('Configurations', [{
        id: uuid(),
        name: newConfigurationName,
        defaultValue: host,
        description: 'API Hostname configuration. Connector will connect to this hostname',
        type: 'string',
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { transaction });
    } catch (err) {
      console.error(err);
      transaction.rollback();
    }
  }),

  down: async queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      const [configurationIds] = await queryInterface.sequelize.query(
        'SELECT id from "Configurations" WHERE name = :name;',
        { replacements: { name: newConfigurationName } },
        { type: queryInterface.sequelize.QueryTypes.SELECT },
        { transaction },
      );

      await queryInterface.bulkDelete(
        'AccountConfigurations',
        { configurationId: configurationIds.map(c => c.id) },
        { type: queryInterface.sequelize.QueryTypes.BULKDELETE },
        { transaction },
      );

      return queryInterface.bulkDelete(
        'Configurations',
        { name: newConfigurationName },
        { type: queryInterface.sequelize.QueryTypes.BULKDELETE },
        { transaction },
      );
    } catch (err) {
      console.log(err);
      return transaction.rollback();
    }
  }),

};
