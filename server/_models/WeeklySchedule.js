
export default function (sequelize, DataTypes) {
  const defaultDailySchedule = {
    isClosed: false,
    startTime: '08:00:00',
    endTime: '17:00:00',
    breaks: [],
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
    },

    tuesday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    wednesday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    thursday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    friday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    saturday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    sunday: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: defaultDailySchedule,
    },

    // TODO: remove this once we are swapped to be parentId architecture
    weeklySchedules: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
    },
  });

  return WeeklySchedule;
}
