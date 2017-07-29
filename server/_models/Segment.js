const StatusError = require('../util/StatusError');

export default function (sequelize, DataTypes) {
  const REFERENCE = {
    ENTERPRISE: 'enterprise',
    ACCOUNT: 'account',
  };

  const Segment = sequelize.define('Segment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 255],
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    referenceId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
    },

    reference: {
      type: DataTypes.ENUM,
      values: Object.keys(REFERENCE).map(key => REFERENCE[key]),
      allowNull: false,
    },

    where: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    rawWhere: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  });

  // Instance functions
  Segment.prototype.isOwner = function isOwner(req) {
    const isAccountAndOwner = this.reference === REFERENCE.ACCOUNT &&
      this.referenceId !== req.accountId;

    const isEnterpriseAndOwner = this.reference === REFERENCE.ENTERPRISE &&
      this.referenceId !== req.enterpriseId;

    if ((isAccountAndOwner) || (isEnterpriseAndOwner)) {
      throw new StatusError(StatusError.FORBIDDEN, 'You are not owner of this segment');
    }
  };

  // Allowing constant to be available for usage outside of model
  Segment.REFERENCE = REFERENCE;

  return Segment;
};
