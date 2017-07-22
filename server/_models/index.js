const Sequelize = require('sequelize');
// Getting config for postgres
const { postgres } = require('../config/globals');

const db = {};

// initialize sequelize
const sequelize = new Sequelize(
  postgres.database,
  postgres.username,
  postgres.password,
  {
    logging: false, // eslint-disable-line
    dialect: 'postgres',
    host: postgres.host,
    port: postgres.port,
    define: {
      underscored: false,
      paranoid: true,
    },
  }
);

// Import and store all models.
const models = [];
models.push(sequelize.import('./Segment/segment'));

models.forEach((model) => {
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
