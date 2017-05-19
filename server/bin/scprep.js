const models = require('../models');

// Will default to this list of tables if there are no arguments to the script
const defaultTables = ['Patient', 'Appointment', 'Chair', 'Practitioner', 'SyncClientError', 'Family'];

/**
 * Remove these tables because sync client expects them to be empty
 * on the first sync.
 */
function prepForSyncClient(tables) {
  console.log(`Removing contents of tables ${tables}`);

  return tables.forEach((tableName) => {
    models[tableName].run()
      .then((results) => {
        return Promise.all(results.map(result => result.delete()))
          .then(() => console.log(`Erased ${tableName} table`));
      })
      .catch((err) => {
        console.error(`Error erasing ${tableName}`);
        console.error(err);
        process.exit(1);
      });
  });
}

/**
 * If no arguments are given, default to `defaultTables` array for erasing.
 * Else use tables in the arguments - `tables`.
 *
 * List tables space-separated
 * e.g. node server/bin/scprep.js Patient Appointment SyncClientError
 */
const argTables = [];
for (let i = 2; i < process.argv.length; i++) {
  argTables.push(process.argv[i]);
}

prepForSyncClient((argTables.length !== 0) ? argTables : defaultTables);
