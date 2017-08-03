
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
  'PractitionerRecurringTimeOff',
  'Appointment',
  'Request',
  'Recall',
  'Reminder',
  'SentRecall',
  'SentReminder',
  'SyncClientError',
  'SyncClientVersion',
  'Token',
  'WaitSpot',
  'Chat',
  'TextMessage',
  'Call',
  'PinCode',
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
  'PractitionerRecurringTimeOff',
  'Appointment',
  'Request',
  'Recall',
  'Reminder',
  'SentRecall',
  'SentReminder',
  'SyncClientError',
  'SyncClientVersion',
  'Token',
  'WaitSpot',
  'Chat',
  'TextMessage',
  'Call',
  'PinCode',
];

const chantaleId = '1457bf9b-dc94-46f0-95f5-fc398fb6f59b';
const lalaId1 = '1b9606bc-3666-40d0-a6e7-7770d605b815';
const lalaId2 = '79c256b9-0345-4e9d-aadb-280d292d778b';
const mediId = '9ba0dbf9-64b2-41e7-a263-e634431c5e71';
const cbibetId = 'a660eb1c-dbd3-48c8-aa85-1f154229e45e';
const mxlpsId = 'ada2fcb1-d542-47d5-ad68-1ecc468d0e13';
const silvaId = 'be4b890e-1b07-4871-9947-1b4b9ad47227';
const saharId = '3edbace7-5c78-48ee-986b-bb1336060957';

const emailRemoval = {
  [chantaleId]: true,
  [lalaId1]: true,
  [lalaId2]: true,
  [mediId]: true,
  [cbibetId]: true,
  [mxlpsId]: true,
  [silvaId]: true,
  [saharId]: true,
};

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
    // First remove emails from the ones needing removal
    if (emailRemoval[data.id]) {
      data.email = undefined;
    }

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
  /*Appointment() {
    return appointment => appointment('startDate').gt(new Date(2016, 1, 1));
  }*/
};

const accountsHash = {};
const enterprisesHash = {};
const ignoreLogs = {
  'Practitioner_Service': true,
  'PatientUser': true,
  'TextMessage': true,
  'Chat': true,
};

// Can't do it for all because it would be too expensive
const postFetch = {
  Accounts(accounts) {
    for (const account of accounts) {
      account.enterpriseName = enterprisesHash[account.enterpriseId].name;
      accountsHash[account.id] = account;
    }

    console.log('Account hashMap built');
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

function logResult(result) {
  ORDER.forEach((modelName, i) => {
    const { successes, errors } = result[i];
    console.log(modelName);
    console.log(`---- ${successes} ${modelName} models saved`);
    console.log(`---- ${errors} ${modelName} models failed`);
  });
}

const result = [];

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

      const sequelizeModels = await SequelizeModel.findAll();
      console.log(`${thinkyModels.length} ${modelName} models fetched from Rethink`);
      console.log(`${sequelizeModels.length} ${modelName} models fetched from Sequelize`);
      let dataArray = thinkyModels.map(t => t._makeSavableCopy());
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

          if (!ignoreLogs[modelName]) console.error(errs);
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
            if (!ignoreLogs[modelName]) console.error(err);
            errors++;
            if (data.accountId) {
              const account = accountsHash[data.accountId];
              if (account) console.log(`---- failure in ${account.name} account under ${account.enterpriseName} enterprise`);
            }
          }
        }
      }

      result.push({ successes, errors });
      console.log(`---- ${successes} ${modelName} models saved`);
      console.log(`---- ${errors} ${modelName} models failed`);
    }

    console.log(' ');
    winston.profile('migration');
    console.log(' ');
    logResult(result);
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
