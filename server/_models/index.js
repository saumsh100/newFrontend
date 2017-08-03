const Sequelize = require('sequelize');
// Getting config for postgres
const { postgres } = require('../config/globals');

const db = {};

console.log('postgres config');
console.log(postgres);

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
// models.push((require('./Segment').default(sequelize, Sequelize)));
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
