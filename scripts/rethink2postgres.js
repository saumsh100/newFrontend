
import _ from 'lodash';
import * as ThinkyModels from '../server/models';
import SequelizeModels from '../server/_models';
import { wipeModelSequelize } from '../tests/util/wipeModel';

const ORDER = [
  'Enterprise',
  'WeeklySchedule',
  'Account',
  'Chair',
  'Permission',
  'User',
  'AuthSession',
  'Invite',
  'PatientUser',
  'Family',
  'Patient',
  'Service',
  'Practitioner',
  'Practitioner_Service',
  'Appointment',
  'Request',
];

const TMP_ORDER = [
  'Enterprise',
  'WeeklySchedule',
  'Account',
  'Chair',
  'Permission',
  'User',
  'AuthSession',
  'Invite',
  'PatientUser',
  'Family',
  'Patient',
  'Service',
  'Practitioner',
  'Practitioner_Service',
  'Appointment',
  // 'Request',
];

const TRANSFORM = {
  Practitioner_Service(data) {
    data.practitionerId = data.Practitioner_id;
    data.serviceId = data.Service_id;
    delete data.Practitioner_id;
    delete data.Service_id;
    delete data.id; // thinky joined these ids together, so we have to remove
    delete data.createdAt; // postgres was complaining cause this had timeZone
    return data;
  },

  Patient(data) {
    // If email is a string, trim it, if still defined
    let { email } = data;
    if (email && typeof email === 'string') {
      email = email.trim();
      data.email = email || undefined;
    } else {
      data.email = undefined;
    }

    return data;
  },
};

/**
 *
 * @returns {Promise.<void>}
 */
async function wipeSequelize() {
  const reversedOrder = _.clone(ORDER).reverse();
  for (const modelName of reversedOrder) {
    await wipeModelSequelize(SequelizeModels[modelName]);
  }
}

/**
 * - Loop through ORDER
 *  -
 */
async function main() {
  // Clear Postgres Tables
  try {
    await wipeSequelize();
  } catch (err) {
    console.error('wipeSequelize failed!');
    console.error(err);
    process.exit(1);
  }

  try {
    console.log(' ');
    // Handle model by model...
    for (const modelName of TMP_ORDER) {
      // Pull in all models from Rethink
      // Perform transformation if needed
      // try { saveToPostgres } catch (err) { cache and continue? }
      const ThinkyModel = ThinkyModels[modelName];
      const SequelizeModel = SequelizeModels[modelName];
      const transformFn = TRANSFORM[modelName];
      const thinkyModels = await ThinkyModel.run();
      console.log(`${thinkyModels.length} ${modelName} models fetched from Rethink`);

      console.log(`Preparing ${modelName} models to be saved...`);
      let dataArray = thinkyModels.map((t) => t._makeSavableCopy());
      if (transformFn) {
        dataArray = dataArray.map(data => transformFn(data));
      }

      console.log(`${modelName} models prepped.`);
      let successes = 0;
      let errors = 0;
      if (SequelizeModel.batchSave && modelName !== 'Appointment') {
        try {
          const models = await SequelizeModel.batchSave(dataArray);
          successes = models.length;
        } catch ({ docs, errors: errs }) {
          // console.error('Batch Save Errors');
          // console.error(errs);
          successes = docs.length;
          errors = errs.length;
        }
      } else {
        // Now transfer into Postgres 1 by 1
        for (const data of dataArray) {
          try {
            await SequelizeModel.create(data);
            successes++;
          } catch (err) {
            // console.error(err);
            errors++;
          }
        }
      }

      console.log(`---- ${successes} ${modelName} models saved`);
      console.log(`---- ${errors} ${modelName} models failed`);
    }

    console.log(' ');
    console.log('rethink2postgres migration complete.');
    console.log('Happy days ahead...');
    process.exit();
  } catch (err) {
    console.error('models migration failed!');
    console.error(err);
    process.exit(1);
  }
}


main();
