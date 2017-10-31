const { validateAccountIdPmsId } = require('../util/validators');

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

    patientId: {
      type: DataTypes.UUID,
    },

    serviceId: {
      type: DataTypes.UUID,
    },

    chairId: {
      type: DataTypes.UUID,
    },

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

    note: {
      type: DataTypes.TEXT,
    },

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

    isPending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    customBufferTime: {
      type: DataTypes.INTEGER,
    },

    mark: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['patientId']),
      get() {
        return !this.get('patientId');
      },
    },
  });

  Appointment.associate = (models) => {
    const {
      Account,
      Chair,
      Patient,
      Practitioner,
      SentReminder,
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


    Appointment.hasMany(SentReminder, {
      foreignKey: 'appointmentId',
      as: 'sentReminders',
    });

    Appointment.hasMany(SentReview, {
      foreignKey: 'appointmentId',
      as: 'sentReviews',
    });

    Appointment.belongsTo(Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });
  };

  Appointment.preValidateArray = async function (dataArray) {
    const errors = [];

    // Build instances of the models
    let docs = dataArray.map(p => Appointment.build(p));

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

    return { errors, docs: validatedDocs };
  };

  Appointment.batchSave = async function (dataArray) {
    const { docs, errors } = await Appointment.preValidateArray(dataArray);
    const savableCopies = docs.map(d => d.get({ plain: true }));
    const response = await Appointment.bulkCreate(savableCopies);
    if (errors.length) {
      const errorsResponse = errors.map((error) => {
        error.model = 'Appointment';
        error.errorMessage = 'Appointment save error';
        if (error.errors && error.errors[0]) {
          error.errorMessage = error.errors[0].message;
        }
        return error;
      });

      throw { docs: response, errors: errorsResponse };
    }

    return response;
  };

  return Appointment;
}
