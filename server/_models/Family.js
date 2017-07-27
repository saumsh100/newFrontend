
export default function (sequelize, DataTypes) {
  const Family = sequelize.define('Family', {
    id: {
      // TODO: why not use type UUIDV4
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
    },

    headId: {
      type: DataTypes.UUID,
    },
  });

  Family.associate = (({ Account, Patient }) => {
    Family.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Family.hasMany(Patient, {
      foreignKey: 'familyId',
      as: 'patients',
    });
  });

  Family.preValidateArray = async function (dataArray) {
    const errors = [];

    // Build instances of the models
    let docs = dataArray.map(p => Family.build(p));

    // Now Do ORM Validation
    const validatedDocs = [];
    for (const d of docs) {
      try {
        await d.validate(); // validate against schema
        validatedDocs.push(d);
      } catch (err) {
        err.family = d;
        errors.push(err);
      }
    }

    return { errors, docs: validatedDocs };
  };

  Family.batchSave = async function (dataArray) {
    const { docs, errors } = await Family.preValidateArray(dataArray);
    const savableCopies = docs.map(d => d.get({ plain: true }));
    const response = await Family.bulkCreate(savableCopies);
    if (errors.length) {
      throw { docs: response, errors };
    }

    return response;
  };

  return Family;
}
