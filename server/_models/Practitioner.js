const { validateAccountIdPmsId } = require('../util/validators');
const globals = require('../config/globals');

const TYPE = {
  DENTIST: 'Dentist',
  HYGIENIST: 'Hygienist',
};

export default function (sequelize, DataTypes) {
  const Practitioner = sequelize.define('Practitioner', {
    id: {
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
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(Practitioner, value, this, next);
        },
      },
    },

    type: {
      type: DataTypes.ENUM,
      values: Object.keys(TYPE).map(key => TYPE[key]),
      defaultValue: TYPE.HYGIENIST,
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
    },

    avatarUrl: {
      type: DataTypes.STRING,
    },

    isCustomSchedule: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    fullAvatarUrl: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['avatarUrl']),
      get() {
        return this.get('avatarUrl') ? `${globals.s3.urlPrefix}${this.get('avatarUrl')}` : null;
      },
    },

    weeklyScheduleId: {
      type: DataTypes.UUID,
    },
  });

  Practitioner.associate = (models) => {
    const {
      Account,
      Service,
      Request,
      Appointment,
      DailySchedule,
      WeeklySchedule,
      PractitionerRecurringTimeOff,
      Review,
      SentReview,
    } = models;

    Practitioner.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Practitioner.hasMany(Request, {
      foreignKey: 'practitionerId',
      as: 'requests',
    });

    Practitioner.belongsTo(WeeklySchedule, {
      foreignKey: 'weeklyScheduleId',
      as: 'weeklySchedule',
    });

    Practitioner.hasMany(Appointment, {
      foreignKey: 'practitionerId',
      as: 'appointments',
    });

    Practitioner.hasMany(Review, {
      foreignKey: 'practitionerId',
      as: 'reviews',
    });

    Practitioner.hasMany(SentReview, {
      foreignKey: 'practitionerId',
      as: 'sentReviews',
    });

    Practitioner.hasMany(PractitionerRecurringTimeOff, {
      foreignKey: 'practitionerId',
      as: 'recurringTimeOffs',
    });

    Practitioner.hasMany(DailySchedule, {
      foreignKey: 'practitionerId',
      as: 'dailySchedules',
    });

    Practitioner.belongsToMany(Service, {
      through: 'Practitioner_Service',
      as: 'services',
      foreignKey: 'practitionerId',
    });
  };

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

  Practitioner.TYPE = TYPE;

  return Practitioner;
}
