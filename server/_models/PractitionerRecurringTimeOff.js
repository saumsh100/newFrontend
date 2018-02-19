import { validatePractitionerIdPmsId } from '../util/validators';

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
        // validator for if pmsId and practitionerId are a unique combo
        isUnique(value, next) {
          return validatePractitionerIdPmsId(PractitionerRecurringTimeOff, value, this, next);
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
