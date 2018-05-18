
'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('PatientSearches', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('PatientSearches');
  },
};
