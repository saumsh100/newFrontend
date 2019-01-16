
const { procedureExistsValidation, validateAccountIdPmsId } = require('../util/validators');

const CountryToDentalCode = {
  CA: 'CDA',
  US: 'ADA',
};

function getDentalCodeFromAddress(address) {
  return CountryToDentalCode[address.country];
}

/**
 * [convertProcedureCode prepends the country code depending on the address]
 * @param  {[string]} procedureCode [the code]
 * @param  {[object]} address       [the clinic address]
 * @return {[string]}               [the code with a code type prepend]
 */
function convertProcedureCode(procedureCode, address, dentalCode) {
  return `${dentalCode || getDentalCodeFromAddress(address)}-${procedureCode}`;
}

async function findAddress(Account, Address, accountId) {
  const account = await Account.findOne({
    where: {
      id: accountId,
    },
  });

  return Address.findOne({
    where: {
      id: account.addressId,
    },
  });
}

export default function (sequelize, DataTypes) {
  const DeliveredProcedure = sequelize.define('DeliveredProcedure', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    entryDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    procedureCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    procedureCodeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(DeliveredProcedure, value, this, next);
        },
      },
    },

    units: {
      type: DataTypes.FLOAT,
    },

    totalAmount: {
      type: DataTypes.FLOAT,
    },

    primaryInsuranceAmount: {
      type: DataTypes.FLOAT,
    },

    secondaryInsuranceAmount: {
      type: DataTypes.FLOAT,
    },

    patientAmount: {
      type: DataTypes.FLOAT,
    },

    discountAmount: {
      type: DataTypes.FLOAT,
    },

    practitionerId: {
      type: DataTypes.UUID,
    },
  });

  DeliveredProcedure.associate = (({ Account, Patient, Procedure }) => {
    DeliveredProcedure.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    DeliveredProcedure.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    DeliveredProcedure.belongsTo(Procedure, {
      foreignKey: 'procedureCodeId',
      as: 'procedure',
    });
  });

  DeliveredProcedure.modelHooks = (({ Account, Address, Procedure }) => {

    // All Hooks for prepending the procedure code and creating a procedure code
    // if it doesn't exist
    DeliveredProcedure.hook('beforeValidate', async (deliveredProcedure) => {
      const address = await findAddress(Account, Address, deliveredProcedure.accountId);

      deliveredProcedure.procedureCodeId
        = convertProcedureCode(deliveredProcedure.procedureCode, address);

      await procedureExistsValidation(
        Procedure,
        deliveredProcedure.procedureCodeId,
        getDentalCodeFromAddress(address));
    });

    DeliveredProcedure.hook('beforeBulkUpdate', async (deliveredProcedures) => {
      const address = await findAddress(Account, Address, deliveredProcedures[0].accountId);

      for (let i = 0; i < deliveredProcedures.length; i += 1) {
        deliveredProcedures[i].procedureCodeId
          = convertProcedureCode(deliveredProcedures[i].procedureCode, address);

        await procedureExistsValidation(
          Procedure,
          deliveredProcedures[i].procedureCodeId,
          getDentalCodeFromAddress(address));
      }
    });

    DeliveredProcedure.hook('beforeBulkCreate', async (deliveredProcedures) => {
      const address = await findAddress(Account, Address, deliveredProcedures[0].accountId);

      for (let i = 0; i < deliveredProcedures.length; i += 1) {
        deliveredProcedures[i].procedureCodeId
          = convertProcedureCode(deliveredProcedures[i].procedureCode, address);

        await procedureExistsValidation(
          Procedure,
          deliveredProcedures[i].procedureCodeId,
          getDentalCodeFromAddress(address));
      }
    });
  });

  return DeliveredProcedure;
}
