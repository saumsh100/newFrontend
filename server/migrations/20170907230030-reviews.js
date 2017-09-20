'use strict';

const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

module.exports = {
  up: function (queryInterface, DataTypes) {
    /*
        - add SentReviews table
        - add Reviews table
        - addColumn to account for canSendReviews
     */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('SentReviews', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },

          accountId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Accounts',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          // May not be defined cause it's not easy to always have,
          // clinics might also turn off reviewing practitioners
          practitionerId: {
            type: DataTypes.UUID,
            references: {
              model: 'Practitioners',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Patients',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          appointmentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Appointments',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          isSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },

          isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },

          // Hacky fix for RemindersList algo so that we don't send farther away reminders
          // after sending the short ones
          primaryType: {
            type: DataTypes.ENUM,
            values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
            // TODO: maybe a default value?
            defaultValue: PRIMARY_TYPES.EMAIL,
            allowNull: false,
          },

          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          deletedAt: {
            type: DataTypes.DATE,
          },
        },{ transaction: t });

        await queryInterface.createTable('Reviews', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },

          accountId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Accounts',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          practitionerId: {
            type: DataTypes.UUID,
            references: {
              model: 'Practitioners',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          patientId: {
            type: DataTypes.UUID,
            references: {
              model: 'Patients',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          patientUserId: {
            type: DataTypes.UUID,references: {
              model: 'PatientUsers',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          sentReviewId: {
            type: DataTypes.UUID,
            references: {
              model: 'SentReviews',
              key: 'id',
            },

            onUpdate: 'cascade',
            onDelete: 'set null',
          },

          stars: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
              min: 1,
              max: 5,
            },
          },

          description: {
            type: DataTypes.TEXT,
          },

          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          deletedAt: {
            type: DataTypes.DATE,
          },
        },{ transaction: t });

        await queryInterface.addColumn('Accounts', 'canSendReviews', {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }, { transaction: t });

        await queryInterface.addColumn('Accounts', 'googlePlaceId', {
          type: DataTypes.STRING,
        }, { transaction: t });

        await queryInterface.addColumn('Accounts', 'facebookUrl', {
          type: DataTypes.STRING,
        }, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, DataTypes) {
    /*
        - remove Reviews table
        - remove SentReviews table
        - removeColumn from account for canSendReviews
     */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.dropTable('Reviews', { transaction: t });
        await queryInterface.dropTable('SentReviews', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'canSendReviews', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'googlePlaceId', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'facebookUrl', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};
