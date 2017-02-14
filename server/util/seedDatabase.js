
const models = require('../models');
const _ = require('lodash');
const dropTable = require('../config/db').dropTable;

/**
 * seedDatabase is the full function to wipe and seed
 *
 * @param seedJSON
 * @param config
 * @returns {Promise.<TResult>}
 */
module.exports = function seedDatabase(seedJSON, config = { wipeTables: true }) {
  let wipes = [];
  if (config.wipeTables) {
    console.log('Wiping tables...');
    wipes = _.map(seedJSON, (data, tableName) => {
      return dropTable(tableName)
        .then((results) => {
          // results.forEach(result => result.delete());
          console.log(`Successfully wiped ${tableName} table.`);
        })
        .catch((err) => {
          console.error(`Error wiping ${tableName} table!`);
          console.error(err);
          process.exit(1);
        });
    });
  }

  // Now execute the wipes first then seed
  return Promise.all(wipes).then(() => {
    config.wipeTables && console.log('Seed tables wiped.');
    return addSeedsToDatabase(seedJSON)
      .then(() => {
        console.log('Seeding DB complete!');
        console.log('Adding all the relations');
        require('../models/relations')
      });
  }).catch((err) => {
    console.error('Promise.all failed for seedDatabase');
    console.error(err);
    process.exit(1);
  });
};

/**
 * addSeedsToDatabase will simply take care of adding seeds, might come in handy when we don't
 * want to wipe and simple add to DB for development purposes
 *
 * @param seedJSON
 * @returns {Promise.<TResult>}
 */
module.exports.addSeedsToDatabase = addSeedsToDatabase;

function addSeedsToDatabase(seedJSON) {
  return Promise.all(_.map(seedJSON, (data, tableName) => {
    return models[tableName].save(data)
      .then(() => {
        console.log(`Successfully seeded ${tableName} table.`);
      })
      .catch((err) => {
        console.error(`ERROR SEEDING ${tableName} TABLE!`);
        console.error(err);
        process.exit(1);
      });
  })).then(() => {
    console.log('Finished adding seeds to DB.');
  }).catch((err) => {
    console.error('Promise.all failed for addSeedsToDatabase');
    console.error(err);
    process.exit(1);
  });
}
