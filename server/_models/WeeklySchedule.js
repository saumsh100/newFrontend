import moment from 'moment';

import { timeWithZone } from '../util/time';

// Converting to UTC as this is a nested JSON where Sequelize won't do it for us
function makeSetter(value, field, self) {
  value.startTime = moment.utc(value.startTime).toISOString();
  value.endTime = moment.utc(value.endTime).toISOString();

  value.breaks = value.breaks.map((b) => {
    b.startTime = moment.utc(b.startTime).toISOString();
    b.endTime = moment.utc(b.endTime).toISOString();


    return b;
  });

  self.setDataValue(field, value);
}

export default function (sequelize, DataTypes) {
  const startTime = timeWithZone(8, 0, 'America/Los_Angeles');
  const endTime = timeWithZone(17, 0, 'America/Los_Angeles');

  const defaultDailySchedule = {
    isClosed: false,
    startTime,
    endTime,
    breaks: [],
    chairIds: [],
    pmsScheduleId: null,
  };

  const WeeklySchedule = sequelize.define('WeeklySchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    startDate: {
      type: DataTypes.DATE,
    },

    isAdvanced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    monday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'monday', this);
      },
    },

    tuesday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'tuesday', this);
      },
    },

    wednesday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'wednesday', this);
      },
    },

    thursday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'thursday', this);
      },
    },

    friday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'friday', this);
      },
    },

    saturday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'saturday', this);
      },
    },

    sunday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
      set(value) {
        return makeSetter(value, 'sunday', this);
      },
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    // TODO: remove this once we are swapped to be parentId architecture
    weeklySchedules: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
    },
  });

  return WeeklySchedule;
}
