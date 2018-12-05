
import moment from 'moment';
import globals from '../config/globals';
import { validateAccountIdPmsId } from '../util/validators';
import Appointemnts from '../../client/entities/models/Appointments';

export default function (sequelize, DataTypes) {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    practitionerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: { type: DataTypes.UUID },

    serviceId: { type: DataTypes.UUID },

    chairId: { type: DataTypes.UUID },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(Appointment, value, this, next);
        },
      },
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isBookable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    originalDate: { type: DataTypes.DATE },

    note: { type: DataTypes.TEXT },

    isReminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isPatientConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isSyncedWithPms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isSyncedWithPMS: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['isSyncedWithPms']),
      get() {
        return !!this.get('isSyncedWithPms');
      },
      set(value) {
        this.setDataValue('isSyncedWithPms', value);
      },
    },

    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isShortCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      set(value) {
        this.setDataValue('isShortCancelled', value);
        if (value === true) {
          this.setDataValue('isCancelled', value);
        }
      },
    },

    isMissed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isPending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    customBufferTime: { type: DataTypes.INTEGER },

    mark: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['patientId']),
      get() {
        return !this.get('patientId');
      },
    },

    reason: { type: DataTypes.STRING },

    isPreConfirmed: { type: DataTypes.BOOLEAN },

    estimatedRevenue: { type: DataTypes.FLOAT },

    isRecall: { type: DataTypes.BOOLEAN },
  });

  Appointment.REQUEST_REASON = 'Appointment Request - CareCru';

  Appointment.associate = (models) => {
    const {
      AppointmentCode,
      Account,
      Chair,
      Patient,
      Practitioner,
      SentRemindersPatients,
      Service,
      SentReview,
    } = models;

    Appointment.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Appointment.belongsTo(Chair, {
      foreignKey: 'chairId',
      as: 'chair',
    });

    Appointment.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    Appointment.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    Appointment.hasMany(SentRemindersPatients, {
      foreignKey: 'appointmentId',
      as: 'sentRemindersPatients',
    });

    Appointment.hasMany(SentReview, {
      foreignKey: 'appointmentId',
      as: 'sentReviews',
    });

    Appointment.hasMany(AppointmentCode, {
      foreignKey: 'appointmentId',
      as: 'appointmentCodes',
    });

    Appointment.belongsTo(Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });
  };

  Appointment.preValidateArray = async function (dataArray) {
    const errors = [];

    // Build instances of the models
    const docs = dataArray.map(p => Appointment.build(p));

    // Now Do ORM Validation
    const validatedDocs = [];
    for (const d of docs) {
      try {
        await d.validate(); // validate against schema
        validatedDocs.push(d);
      } catch (err) {
        err.patient = d;
        errors.push(err);
      }
    }

    return {
      errors,
      docs: validatedDocs,
    };
  };

  Appointment.batchSave = async function (dataArray) {
    const { docs, errors } = await Appointment.preValidateArray(dataArray);
    const savableCopies = docs.map(d => d.get({ plain: true }));
    const response = await Appointment.bulkCreate(savableCopies);

    if (errors.length === 0) {
      return response;
    }

    const errorsResponse = errors.map((error) => {
      const errorMessage = error.errors && error.errors[0]
        ? error.errors[0].message
        : 'Appointment save error';

      return {
        ...error,
        model: 'Appointment',
        errorMessage,
      };
    });

    return Promise.reject({
      docs: response,
      errors: errorsResponse,
    });
  };

  Appointment.prototype.confirm = async function ({
    isCustomConfirm,
    customConfirmData,
  }) {
    const mergeData = {
      ...(isCustomConfirm ? customConfirmData : { isPatientConfirmed: true }),
      isSyncedWithPms: false,
    };
    const appointmentsToConfirm = await Appointment.findAll({
      where: {
        accountId: this.accountId,
        patientId: this.patientId,
        ...Appointemnts.getCommonSearchAppointmentSchema({ isPatientConfirmed: false }),
        startDate: {
          $gte: this.startDate,
          $lte: moment(this.startDate).add(
            globals.reminders.get('sameDayWindowHours'),
            'hours',
          ),
        },
      },
    });
    return Promise.all(appointmentsToConfirm.map(apt => apt.update(mergeData)));
  };

  Appointment.getCommonSearchAppointmentSchema = (options = {}) => ({
    isCancelled: false,
    isDeleted: false,
    isMissed: false,
    isPending: false,
    practitionerId: { $not: null },
    chairId: { $not: null },
    ...options,
  });

  return Appointment;
}
