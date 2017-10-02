
export default function (sequelize, DataTypes) {
  const PractitionerRecurringTimeOff = sequelize.define('PractitionerRecurringTimeOff', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.DATE,
    },

    endTime: {
      type: DataTypes.DATE,
    },

    interval: {
      type: DataTypes.INTEGER,
    },

    allDay: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    fromPMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        isUnique(value, next) {
          // validator for if pmsId and accountId are a unique combo
          return PractitionerRecurringTimeOff.findOne({
            where: {
              practitionerId: this.practitionerId,
              pmsId: value,
            },
            paranoid: false,
          }).then(async (timeOff) => {
            if (timeOff) {
              timeOff.setDataValue('deletedAt', null);
              timeOff = await timeOff.save({ paranoid: false });

              return next({
                messages: 'PractitionerId PMS ID Violation',
                model: timeOff,
              });
            }

            return next();
          });
        },
      },
    },

    dayOfWeek: {
      type: DataTypes.ENUM,
      values: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },

    note: {
      type: DataTypes.STRING,
    },
  });

  return PractitionerRecurringTimeOff;
}
