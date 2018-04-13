'use strict';

const UUID = require('uuid');
const uuid = UUID.v4;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('PatientUserFamilies', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          headId: {
            type: Sequelize.UUID,
            references: {
              model: 'PatientUsers',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          deletedAt: {
            type: Sequelize.DATE,
          },
        }, { transaction: t });

        await queryInterface.addColumn(
          'PatientUsers',
          'patientUserFamilyId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'PatientUserFamilies',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'PatientUsers',
          'gender',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'PatientUsers',
          'birthDate',
          {
            type: Sequelize.DATE,
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'PatientUsers',
          'password',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'PatientUsers',
          'phoneNumber',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'PatientUsers',
          'email',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        /*
           Now create a patientUserFamily for every patientUser and update patientUsers
         */
        const [patientUsers] = await queryInterface.sequelize
          .query(`SELECT "id" FROM "PatientUsers";`, { transaction: t });

        if (!patientUsers.length) return;

        const patientUserFamiliesData = patientUsers.map((p) => {
          return {
            id: uuid(),
            headId: p.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        });

        await queryInterface.bulkInsert(
          'PatientUserFamilies',
          patientUserFamiliesData,
          { transaction: t },
        );

        const [patientUserFamilies] = await queryInterface.sequelize
          .query(`SELECT "id", "headId" FROM "PatientUserFamilies";`, { transaction: t });

        for (let i = 0; i < patientUserFamilies.length; i++) {
          const { id, headId } = patientUserFamilies[i];
          await queryInterface.sequelize
            .query(`
              UPDATE "PatientUsers"
              SET "patientUserFamilyId" = '${id}'
              WHERE "id" = '${headId}';
            `, { transaction: t });
        }
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.changeColumn(
        'PatientUsers',
        'phoneNumber',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t },
      );

      await queryInterface.changeColumn(
        'PatientUsers',
        'email',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t },
      );

      await queryInterface.removeColumn(
        'PatientUsers',
        'patientUserFamilyId',
        { transaction: t },
      );

      await queryInterface.removeColumn(
        'PatientUsers',
        'gender',
        { transaction: t },
      );

      await queryInterface.removeColumn(
        'PatientUsers',
        'birthDate',
        { transaction: t },
      );

      await queryInterface.dropTable(
        'PatientUserFamilies',
        { transaction: t },
      );
    });
  },
};
