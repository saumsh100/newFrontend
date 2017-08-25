
const Sequelize = require('sequelize');
const { postgres } = require('../config/globals');

const sequelizeConfig = {
  logging: false,
  dialect: 'postgres',
  host: postgres.host,
  port: postgres.port,
  define: {
    underscored: false,
    paranoid: true,
  },
};

// Don't use NODE_ENV===production
// It doesn't let us debug production locally easily
if (postgres.ssl) {
  sequelizeConfig.dialectOptions = {
    ssl: true,
  };
}

// If true, sequelize will dump all PostgreSQL queries into terminal
if (postgres.logging) {
  sequelizeConfig.logging = console.log // eslint-disable-line
}

// initialize sequelize
const sequelize = new Sequelize(
  postgres.database,
  postgres.username,
  postgres.password,
  sequelizeConfig,
  );

// Test the connection for logs
sequelize
  .authenticate()
  .then(() => {
    console.log(`Sequelize connected to database=${postgres.database} at host:port=${postgres.host}:${postgres.port}`);
  })
  .catch(err => {
    console.error('postgres config', postgres);
    console.error('Unable to connect to the database:', err);
  });

// Import and store all models.
const models = [];
// models.push((require('./Address').default(sequelize, Sequelize)));
models.push((require('./Account').default(sequelize, Sequelize)));
models.push((require('./Appointment').default(sequelize, Sequelize)));
models.push((require('./AuthSession').default(sequelize, Sequelize)));
models.push((require('./Call').default(sequelize, Sequelize)));
models.push((require('./Chair').default(sequelize, Sequelize)));
models.push((require('./Chat').default(sequelize, Sequelize)));
models.push((require('./Enterprise').default(sequelize, Sequelize)));
models.push((require('./Family').default(sequelize, Sequelize)));
models.push((require('./Invite').default(sequelize, Sequelize)));
models.push((require('./Patient').default(sequelize, Sequelize)));
models.push((require('./PatientUser').default(sequelize, Sequelize)));
models.push((require('./Permission').default(sequelize, Sequelize)));
models.push((require('./PinCode').default(sequelize, Sequelize)));
models.push((require('./Practitioner').default(sequelize, Sequelize)));
models.push((require('./Practitioner_Service').default(sequelize, Sequelize)));
models.push((require('./PractitionerRecurringTimeOff').default(sequelize, Sequelize)));
models.push((require('./Recall').default(sequelize, Sequelize)));
models.push((require('./Reminder').default(sequelize, Sequelize)));
models.push((require('./Request').default(sequelize, Sequelize)));
models.push((require('./Segment').default(sequelize, Sequelize)));
models.push((require('./SentRecall').default(sequelize, Sequelize)));
models.push((require('./SentReminder').default(sequelize, Sequelize)));
models.push((require('./Service').default(sequelize, Sequelize)));
models.push((require('./SyncClientError').default(sequelize, Sequelize)));
models.push((require('./SyncClientVersion').default(sequelize, Sequelize)));
models.push((require('./TextMessage').default(sequelize, Sequelize)));
models.push((require('./Token').default(sequelize, Sequelize)));
models.push((require('./User').default(sequelize, Sequelize)));
models.push((require('./WaitSpot').default(sequelize, Sequelize)));
models.push((require('./WeeklySchedule').default(sequelize, Sequelize)));

const db = {};
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
