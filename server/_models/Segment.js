
import moment from 'moment';
import { isValidUUID } from '@carecru/isomorphic';

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

  Segment.convertRawToSequelizeWhere = function (raw) {
    const patientWhere = {};
    const accountWhere = {};

    if (raw.city) {
      accountWhere.city = raw.city;
    }

    if (raw.gender) {
      patientWhere.gender = raw.gender;
    }

    if (raw.age) {
      const ageRanges = [];


      raw.age.forEach((ageSet) => {
        const ages = ageSet.split('-');
        if (!ages[1]) {
          const age = ages[0].replace('+', '');
          ageRanges.push({
            $lte: [moment().add(-parseInt(age, 10), 'years').toISOString()],
          });
        } else {
          ageRanges.push({
            $lte: moment().add(-parseInt(ages[0], 10), 'years').endOf('year').toISOString(),
            $gte: moment().add(-parseInt(ages[1], 10), 'years').startOf('year').toISOString(),
          });
          // ageRanges.push({
          //   // $between: [moment().add(-parseInt(ages[1], 10), 'years').toISOString(), moment().add(-parseInt(ages[0], 10), 'years').toISOString()],
          //   //{
          //   $lte: moment().add(-parseInt(ages[0], 10), 'years').endOf('year').toISOString(),
          //   $gte: moment().add(-parseInt(ages[1], 10), 'years').startOf('year').toISOString(),
          //   // }
          // });
        }
      });
      patientWhere.birthDate = {
        $or: ageRanges,
      };
    }

    return {
      account: accountWhere,
      patient: patientWhere,
    };
  };

  Segment.convertOrFetch = async function (item, req) {
    if (!isValidUUID(item)) {
      if (typeof item === 'string') {
        return Segment.convertRawToSequelizeWhere(JSON.parse(item));
      }
      return Segment.convertRawToSequelizeWhere(item);
    }

    // @todo add check if item is uuid
    const segment = await Segment.findById(item);

    // if segment is null throw error
    if (!segment) {
      throw new StatusError(StatusError.BAD_REQUEST, `Data for Segment with id: ${item} do not exists`);
    }
    // confirm if user has sent segment he has access to use
    segment.isOwner(req);

    const rawSegment = segment.get({
      plain: true,
    });

    return rawSegment.where;
  };

  // Allowing constant to be available for usage outside of model
  Segment.REFERENCE = REFERENCE;

  return Segment;
}
