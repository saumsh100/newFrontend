const models = require('../models');

/**
 * Remove these tables because sync client expects them to be empty
 * on the first sync.
 */
function prepForSyncClient() {
  const cleanTables = ['Patient', 'Appointment', 'Chair', 'Practitioner'];
  console.log(`Removing contents of tables ${cleanTables}`);
  
  return cleanTables.forEach((tableName) => { 
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

prepForSyncClient();
