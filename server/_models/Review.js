
export default function (sequelize, DataTypes) {
  const Review = sequelize.define('Review', {
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
    },

    patientId: {
      type: DataTypes.UUID,
    },

    patientUserId: {
      type: DataTypes.UUID,
    },

    sentReviewId: {
      type: DataTypes.UUID,
    },

    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    description: {
      type: DataTypes.TEXT,
    },
  });

  Review.associate = ({ Account, Patient, Practitioner, PatientUser, SentReview }) => {
    Review.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Review.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    Review.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    Review.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });

    Review.belongsTo(SentReview, {
      foreignKey: 'sentReviewId',
      as: 'sentReview',
    });
  };

  return Review;
}
