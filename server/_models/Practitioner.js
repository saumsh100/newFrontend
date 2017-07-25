
export default function (sequelize, DataTypes) {
  const Practitioner = sequelize.define('Practitioner', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    type: {
      type: DataTypes.STRING,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    avatarUrl: {
      type: DataTypes.STRING,
    },

    isCustomSchedule: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    weeklyScheduleId: {
      type: DataTypes.UUID,
    },
  });

  Practitioner.associate = (({ Account, Service }) => {
    Practitioner.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Practitioner.belongsToMany(Service, {
      through: 'Practitioner_Service',
      as: 'services',
      foreignKey: 'practitionerId',
    });
  });

  /*Practitioner.prototype.getWeeklySchedule = function () {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.isCustomSchedule) {
        return WeeklySchedule.get(self.weeklyScheduleId)
          .then(ws => resolve(ws))
          .catch(err => reject(err));
      }

      return Account.get(self.accountId).getJoin({ weeklySchedule: true })
        .then(account => resolve(account.weeklySchedule))
        .catch(err => reject(err));
  };*/

  return Practitioner;
}
