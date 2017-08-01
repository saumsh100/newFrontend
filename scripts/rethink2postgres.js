
import _ from 'lodash';
import winston from 'winston';
import * as ThinkyModels from '../server/models';
import SequelizeModels from '../server/_models';
import { wipeModelSequelize } from '../tests/util/wipeModel';

// TODO: how to get colors to work
winston.add(winston.transports.File, {
  filename: '../../rethink2postgres.log',
  colorize: true,
});

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
  'Recall',
  'SentRecall',
  'SentReminder',
  'SyncClientError',
  'SyncClientVersion',
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
  //'Family',
  //'Patient',
  'Service',
  'Practitioner',
  'Practitioner_Service',
  //'Appointment',
  //'Request',
  //'Reminder',
  //'SentReminder',
  //'Recall',
  //'SentRecall',
  //'SyncClientError',
  //'SyncClientVersion',
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

const FILTER = {
  Appointment() {
    return appointment => appointment('startDate').gt(new Date(2016, 1, 1));
  }
};

const accountsHash = {};
const enterprisesHash = {};

// Can't do it for all because it would be too expensive
const postFetch = {
  Accounts(accounts) {
    for (const account of accounts) {
      account.enterpriseName = enterprisesHash[account.enterpriseId].name;
      accountsHash[account.id] = account;
    }
  },

  Enterprise(enterprises) {
    for (const enterprise of enterprises) {
      enterprisesHash[enterprise.id] = enterprise;
    }

    console.log('Enterprise hashMap built');
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
 *
 */
function splitLargeArray(dataArray, largeNum) {

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
    winston.profile('migration');
    // Handle model by model...
    for (const modelName of TMP_ORDER) {
      // Pull in all models from Rethink
      // Perform transformation if needed
      // try { saveToPostgres } catch (err) { cache and continue? }
      const ThinkyModel = ThinkyModels[modelName];
      const SequelizeModel = SequelizeModels[modelName];
      const transformFn = TRANSFORM[modelName];
      const filterFn = FILTER[modelName];
      const postFetchFn = postFetch[modelName];
      let thinkyModels;
      if (filterFn) {
        console.log(`Invoking FILTER for ${modelName}`);
        thinkyModels = await ThinkyModel.filter(filterFn()).run();
      } else {
        thinkyModels = await ThinkyModel.run();
      }

      console.log(`${thinkyModels.length} ${modelName} models fetched from Rethink`);
      let dataArray = thinkyModels.map((t) => t._makeSavableCopy());
      if (transformFn) {
        dataArray = dataArray.map(data => transformFn(data));
      }

      if (postFetchFn) {
        postFetchFn(dataArray);
      }

      let successes = 0;
      let errors = 0;
      if (SequelizeModel.batchSave && modelName !== 'Appointment') {
        try {
          const models = await SequelizeModel.batchSave(dataArray);
          successes = models.length;
        } catch (error) {
          const { errors: errs, docs } = error;
          if (!_.isArray(errs) || !_.isArray(docs)) {
            throw error;
          }

          // console.error(error);
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
            if (data.accountId) {
              const account = accountsHash[data.accountId];
              console.log(`---- failure in ${account.name} account under ${account.enterpriseName} enterprise`);
            }
          }
        }
      }

      console.log(`---- ${successes} ${modelName} models saved`);
      console.log(`---- ${errors} ${modelName} models failed`);
    }

    console.log(' ');
    winston.profile('migration');
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
