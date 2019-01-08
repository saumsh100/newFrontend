
import { dateDiffInMinutes } from '@carecru/isomorphic';
import { validatePractitionerIdPmsId } from '../util/validators';

const CLOSED_DAY_BUFFER_MINUTES = 30;

export default function (sequelize, DataTypes) {
  const DailySchedule = sequelize.define('DailySchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
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

    practitionerId: { type: DataTypes.UUID },

    date: { type: DataTypes.DATEONLY },

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

    isClosed: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      get() {
        return dateDiffInMinutes(this.startTime, this.endTime) < CLOSED_DAY_BUFFER_MINUTES;
      },
      set(val) {
        if (val === true) {
          this.startTime = new Date('1970-01-01T00:00:00.000Z');
          this.endTime = this.startTime;
        }
      },
    },
  });

  DailySchedule.associate = ({ Account, Practitioner }) => {
    DailySchedule.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    DailySchedule.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });
  };

  return DailySchedule;
}
