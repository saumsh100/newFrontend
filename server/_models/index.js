
const path = require('path');
const Sequelize = require('sequelize');
const glob = require('glob');
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

// use glob to get all js files from _models folder
const files = glob.sync('**/*.js', {
  cwd: path.resolve(`${__dirname}/`),
});

files.forEach((file) => {
  if (file !== 'index.js') {
    const model = sequelize.import(`${__dirname}/${file}`);
    db[model.name] = model;
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
