
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
  pool: {
    max: 20,
    min: 0,
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
  sequelizeConfig.logging = console.log; // eslint-disable-line
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
models.push((require('./Account').default(sequelize, Sequelize)));
models.push((require('./Address').default(sequelize, Sequelize)));
models.push((require('./AccountCronConfiguration').default(sequelize, Sequelize)));
models.push((require('./AccountConfiguration').default(sequelize, Sequelize)));
models.push((require('./Appointment').default(sequelize, Sequelize)));
models.push((require('./AppointmentCode').default(sequelize, Sequelize)));
models.push((require('./AuthSession').default(sequelize, Sequelize)));
models.push((require('./Call').default(sequelize, Sequelize)));
models.push((require('./Chair').default(sequelize, Sequelize)));
models.push((require('./Chat').default(sequelize, Sequelize)));
models.push((require('./Configuration').default(sequelize, Sequelize)));
models.push((require('./ConnectorVersion').default(sequelize, Sequelize)));
models.push((require('./Correspondence').default(sequelize, Sequelize)));
models.push((require('./CronConfiguration').default(sequelize, Sequelize)));
models.push((require('./DeliveredProcedure').default(sequelize, Sequelize)));
models.push((require('./Enterprise').default(sequelize, Sequelize)));
models.push((require('./Family').default(sequelize, Sequelize)));
models.push((require('./Invite').default(sequelize, Sequelize)));
models.push((require('./PasswordReset').default(sequelize, Sequelize)));
models.push((require('./PatientUserReset').default(sequelize, Sequelize)));
models.push((require('./Patient').default(sequelize, Sequelize)));
models.push((require('./PatientUser').default(sequelize, Sequelize)));
models.push((require('./PatientUserFamily').default(sequelize, Sequelize)));
models.push((require('./Permission').default(sequelize, Sequelize)));
models.push((require('./PinCode').default(sequelize, Sequelize)));
models.push((require('./Practitioner').default(sequelize, Sequelize)));
models.push((require('./Practitioner_Service').default(sequelize, Sequelize)));
models.push((require('./PractitionerRecurringTimeOff').default(sequelize, Sequelize)));
models.push((require('./DailySchedule').default(sequelize, Sequelize)));
models.push((require('./Procedure').default(sequelize, Sequelize)));
models.push((require('./Recall').default(sequelize, Sequelize)));
models.push((require('./Reminder').default(sequelize, Sequelize)));
models.push((require('./Request').default(sequelize, Sequelize)));
models.push((require('./Review').default(sequelize, Sequelize)));
models.push((require('./Segment').default(sequelize, Sequelize)));
models.push((require('./SentRecall').default(sequelize, Sequelize)));
models.push((require('./SentReminder').default(sequelize, Sequelize)));
models.push((require('./SentReview').default(sequelize, Sequelize)));
models.push((require('./Service').default(sequelize, Sequelize)));
models.push((require('./SyncClientError').default(sequelize, Sequelize)));
models.push((require('./SyncClientVersion').default(sequelize, Sequelize)));
models.push((require('./TextMessage').default(sequelize, Sequelize)));
models.push((require('./Token').default(sequelize, Sequelize)));
models.push((require('./User').default(sequelize, Sequelize)));
models.push((require('./WaitSpot').default(sequelize, Sequelize)));
models.push((require('./WeeklySchedule').default(sequelize, Sequelize)));
models.push((require('./Event').default(sequelize, Sequelize)));


const db = {};
models.forEach((model) => {
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].scopes) {
    db[modelName].scopes(db);
  }

  if (db[modelName].modelHooks) {
    db[modelName].modelHooks(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
