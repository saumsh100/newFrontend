const postgres = require('./globals').postgres;

let dialectOptions;

if (process.env.NODE_ENV === 'production') {
  dialectOptions = {
    ssl: {
      require: true,
    },
  };
}

module.exports = {
  dialect: 'postgres',
  database: postgres.database,
  host: postgres.host,
  port: postgres.port,
  dialectOptions,
};
