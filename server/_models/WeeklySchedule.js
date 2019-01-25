
import moment from 'moment';
import omit from 'lodash/omit';
import { timeWithZone } from '@carecru/isomorphic';

// Converting to UTC as this is a nested JSON where Sequelize won't do it for us
function makeSetter(value, field, self) {
  value.startTime = moment.utc(value.startTime).toISOString();
  value.endTime = moment.utc(value.endTime).toISOString();

  value.breaks = value.breaks || [];

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

  const WeeklySchedule = sequelize.define('WeeklySchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    startDate: { type: DataTypes.DATE },

    isAdvanced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    pmsId: { type: DataTypes.STRING },

    // TODO: remove this once we are swapped to be parentId architecture
    weeklySchedules: { type: DataTypes.ARRAY(DataTypes.JSONB) },
  });

  WeeklySchedule.associate = (({ DailySchedule, Account }) => {
    WeeklySchedule.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'mondayId',
      as: 'monday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'tuesdayId',
      as: 'tuesday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'wednesdayId',
      as: 'wednesday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'thursdayId',
      as: 'thursday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'fridayId',
      as: 'friday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'saturdayId',
      as: 'saturday',
    });

    WeeklySchedule.belongsTo(DailySchedule, {
      foreignKey: 'sundayId',
      as: 'sunday',
    });
  });

  WeeklySchedule.scopes = () => {
    WeeklySchedule.addScope('defaultScope', {
      include: [
        { association: 'monday' },
        { association: 'tuesday' },
        { association: 'wednesday' },
        { association: 'thursday' },
        { association: 'friday' },
        { association: 'saturday' },
        { association: 'sunday' },
      ],
    }, { override: true });
  };

  return WeeklySchedule;
}

/*
  This list contains the association names of DailySchedule to weeklySchedule.
  This list is used to reduce 7 individual DailySchedule (monday to sunday) logic into one.
 */
export const dailyScheduleNameList = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
};

export const dayNamesList = Object.keys(dailyScheduleNameList);

/**
 * Update the DailySchedules of a weeklySchedule if such provided in the body.
 * If the updateDailySchedules have attributes
 * {monday, tuesday, wednesday, thursday, friday, saturday, sunday},
 * those corresponding dailySchedules will be updated
 *
 * @param weeklySchedule
 * @param updateDailySchedules
 * @returns {Promise<void>}
 */
export async function updateDaySchedules(weeklySchedule, updateDailySchedules, DailySchedule) {
  return Promise.all(Object.entries(weeklySchedule.get({ plain: true }))
    .filter(([key, value]) => (dailyScheduleNameList[key] && value && updateDailySchedules[key]))
    .map(([key, { id }]) => DailySchedule.update(updateDailySchedules[key], { where: { id } })));
}

/**
 * Generate the Default DailySchedule for WeeklySchedules
 *
 * @param practitionerId
 * @param accountId
 * @returns Object contain monday to sunday default daily schedules
 */
export function generateDefaultDailySchedules({ practitionerId, accountId }) {
  const defaultDailySchedule = generateDefaultDailySchedule({
    practitionerId,
    accountId,
  });
  return dayNamesList
    .reduce((pre, cur) => ({
      ...pre,
      [cur]: defaultDailySchedule,
    }), {});
}

/**
 * Generate the Default DailySchedule for WeeklySchedules
 *
 * @param practitionerId
 * @param accountId
 * @returns Object contain monday to sunday default daily schedules
 */
export function generateDefaultDailySchedule({ practitionerId, accountId }) {
  return {
    practitionerId,
    accountId,
    startTime: '1970-01-31T16:00:00.000Z',
    endTime: '1970-02-01T01:00:00.000Z',
  };
}

/**
 * saveWeeklyScheduleWithDefaults is an async function primarily used in the tests
 * to save a weeklySchedule object as if we used to save them
 *
 * @param weeklyScheduleData { monday,, wednesday, ...etc }
 * @returns Object contain monday to sunday default daily schedules
 */
export async function saveWeeklyScheduleWithDefaults(weeklyScheduleData, WeeklyScheduleModel) {
  const defaultDailySchedule = generateDefaultDailySchedule(weeklyScheduleData);
  const finalWeeklyScheduleData = dayNamesList.reduce((weeklySchedule, dayOfWeek) => ({
    ...weeklySchedule,
    // Use defaultDailySchedules to help with default properties as well
    [dayOfWeek]: {
      ...defaultDailySchedule,
      ...weeklySchedule[dayOfWeek],
    },
  }), weeklyScheduleData);

  return WeeklyScheduleModel.create(
    finalWeeklyScheduleData,
    { include: dayNamesList.map(day => ({ association: day })) },
  );
}

/**
 * Delete the isClosed field from Body.
 * This is VERY important for connector because if one day is closed,
 * connector will set the startTime = endTime in the connector's timezone.
 * However, since the isClosed field is now virtual,
 * the setter will set the startTime = endTime in the UTC timezone.
 * This becomes problematic because the connector is always comparing the sending/receiving objects
 * when updating models.
 * If not deleting this field, EVERY model with isClosed=true will be updating.
 * The solution for this is not to .update() isClosed field and trust the connector has already set
 * the startTime = endTime.
 * Thus, this function should ONLY and ALWAYS be used by connector endpoints for weeklySchedule
 * @param body includes seven dailySchedules with isClosed field
 */
export function deleteIsClosedFieldFromBody(body) {
  return Object.keys(dailyScheduleNameList).reduce((acc, day) => ({
    ...acc,
    [day]: omit(body[day], ['isClosed']),
  }), body);
}

/**
 * Clean up the weeklySchedule model to reuse it for creating new weeklySchedule.
 * This function is used for converting a officeHour to a weeklySchedule
 * @param weeklySchedule
 */
export function cleanUpWeeklySchedule(weeklySchedule) {
  const cleanedWeeklySchedule = omit(weeklySchedule, ['id', 'createdAt', 'updatedAt']);
  return dayNamesList.reduce((acc, day) => ({
    ...acc,
    [day]: omit(cleanedWeeklySchedule[day], ['id', 'createdAt', 'updatedAt']),
  }), cleanedWeeklySchedule);
}
