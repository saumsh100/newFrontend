const db = require('../_models/');

db.sequelize.sync({ force: true }).then(() => {
  console.log('synced sequelize db');
  process.exit(0);
});
