import { validatePractitionerIdPmsId } from '../util/validators';

export default function (sequelize, DataTypes) {
  const DailySchedule = sequelize.define('DailySchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and practitionerId are a unique combo
        isUnique(value, next) {
          return validatePractitionerIdPmsId(DailySchedule, value, this, next);
        },
      },
    },

    practitionerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    breaks: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      defaultValue: [],
      allowNull: false,
    },

    chairIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  });

  DailySchedule.associate = (({ Practitioner }) => {
    DailySchedule.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });
  });

  return DailySchedule;
}
