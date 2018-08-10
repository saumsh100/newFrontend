'use strict';

const groupBy = require('lodash/groupBy');
const groupPatientsByChannelPoc = require('../lib/contactInfo/groupPatientsByChannelPoc');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeIndex(
          'Patients',
          ['accountId', 'email'],
          { indicesType: 'UNIQUE', transaction: t },
        );

        await queryInterface.removeIndex(
          'Patients',
          ['accountId', 'mobilePhoneNumber'],
          { indicesType: 'UNIQUE', transaction: t },
        );
      } catch (e) {
        console.error(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const [accounts] = await queryInterface.sequelize.query(
          'select * from "Accounts";',
          { transaction: t },
        );

        for (const account of accounts) {
          const [patients] = await queryInterface.sequelize.query(`
            select * from "Patients"
            where "Patients"."accountId" = '${account.id}';
          `, { transaction: t });

          const [families] = await queryInterface.sequelize.query(`
            select * from "Families"
            where "Families"."accountId" = '${account.id}';
          `, { transaction: t });

          const familyMap = groupBy(families, 'id');

          const patientsWithFamilies = patients.map(p => {
            const family = p.familyId && familyMap[p.familyId] ? familyMap[p.familyId][0] : null;
            return family ?
              { ...p, family } :
              p;
          });

          const smsPocs = groupPatientsByChannelPoc({ patients: patientsWithFamilies, fetchedPatients: patientsWithFamilies, channel: 'sms' });
          const emailPocs = groupPatientsByChannelPoc({ patients: patientsWithFamilies, fetchedPatients: patientsWithFamilies, channel: 'email' });
          const keepMobilePhoneNumberIds = smsPocs.success.map(s => s.patient.id);
          const keepEmailIds = emailPocs.success.map(s => s.patient.id);

          await queryInterface.sequelize.query(`
            update "Patients"
            set "mobilePhoneNumber" = null
            where "accountId" = '${account.id}'
            ${keepMobilePhoneNumberIds.length ?
              `and "id" not in (
                ${keepMobilePhoneNumberIds.map(id => `'${id}'`).join(',')}
              );` : ''
            }   
          `, { transaction: t });


          await queryInterface.sequelize.query(`
            update "Patients"
            set "email" = null
            where "accountId" = '${account.id}'
            ${keepEmailIds.length ?
              `and "id" not in (
                ${keepEmailIds.map(id => `'${id}'`).join(',')}
              );` : ''
            }
          `, { transaction: t });
        }

        await queryInterface.addIndex(
          'Patients',
          ['accountId', 'email'],
          { indicesType: 'UNIQUE', transaction: t },
        );

        await queryInterface.addIndex(
          'Patients',
          ['accountId', 'mobilePhoneNumber'],
          { indicesType: 'UNIQUE', transaction: t },
        );
      } catch (e) {
        console.error(e);
        t.rollback();
      }
    });
  }
};
