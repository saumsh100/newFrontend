
export default function (sequelize, DataTypes) {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return Service.findOne({
            where: {
              accountId: this.accountId,
              pmsId: value,
            },
            paranoid: false,
          }).then(async (service) => {
            service.setDataValue('deletedAt', null);
            service = await service.save({ paranoid: false });

            if (service) {
              return next({
                messages: 'AccountId PMS ID Violation',
                model: service,
              });
            }

            return next();
          });
        },
      },
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bufferTime: { type: DataTypes.INTEGER },

    unitCost: {
      // TODO: is this correct?
      type: DataTypes.INTEGER,
    },

    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    reasonWeeklyHoursId: { type: DataTypes.UUID },
  });

  Service.associate = ({ Account, Practitioner, Request }) => {
    Service.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Service.hasMany(Request, {
      foreignKey: 'serviceId',
      as: 'requests',
    });

    Service.belongsToMany(Practitioner, {
      through: 'Practitioner_Service',
      as: 'practitioners',
      foreignKey: 'serviceId',
    });
  };

  return Service;
}
