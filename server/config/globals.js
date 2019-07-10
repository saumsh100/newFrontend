
const path = require('path');
const fs = require('fs');

// Fix paths if env is BUNDLED
const relativePath = process.env.BUNDLED ? '/../..' : '/..';

const root = path.normalize(path.join(__dirname, relativePath));
const tokenSecret = 'notsosecret';
const tokenExpiry = '30d';
const passwordHashSaltRounds = 10;

const environmentVariables = process.env;
const env = environmentVariables.NODE_ENV || 'development';
const port = environmentVariables.PORT || '5000';
const host = environmentVariables.HOST || `localhost:${port}`;
const myHost = environmentVariables.MY_HOST || `my.care.cru:${port}`;
const protocol = env === 'production' ? 'https' : 'http';
const bundlePort = environmentVariables.BUNDLE_PORT || '3050';
const defaultDBName = env === 'test' ? 'carecru_test' : 'carecru_development';
const fullHostUrl = `${protocol}://${host}`;
const apiServerUrl = environmentVariables.API_SERVER_URL;
const newApiUrl = environmentVariables.NEW_API_URL;

const graphQLServerUrl = environmentVariables.GRAPHQL_SERVER_URL;

let caCert = environmentVariables.COMPOSE_CA_CERT;
if (environmentVariables.CERT_PATH) {
  caCert = fs.readFileSync(environmentVariables.CERT_PATH);
}

const redis = {
  host: environmentVariables.REDIS_HOST || 'localhost',
  port: environmentVariables.REDIS_PORT || '6379',
  uri: environmentVariables.REDIS_URL || 'redis://localhost:6379',
};

const rabbitConfig = {
  host: environmentVariables.RABBIT_HOST || 'localhost',
  port: environmentVariables.RABBIT_PORT || null,
  username: environmentVariables.RABBIT_USERNAME || null,
  password: environmentVariables.RABBIT_PASSWORD || null,
};

let user = '';
if (rabbitConfig.username && rabbitConfig.password) {
  user = `${rabbitConfig.username}:${rabbitConfig.password}@`;
}

const rabbit = rabbitConfig.port
  ? `amqp://${user}${rabbitConfig.host}:${rabbitConfig.port}?heartbeat=380`
  : `amqp://${user}${rabbitConfig.host}?heartbeat=380`;

const stubEventsService = !!environmentVariables.STUB_EVENTS_SERVICE || env === 'test';

const namespaces = {
  dash: '/dash',
  sync: '/sync',
};

const modeAnalytics = {
  accessKey: environmentVariables.MODE_ANALYTICS_ACCESS_KEY,
  secret: environmentVariables.MODE_ANALYTICS_SECRET,
};

const callrails = {
  apiKey: environmentVariables.CALLRAIL_API_KEY,
  apiAccount: environmentVariables.CALLRAIL_API_ACCOUNTID,
};

const launchDarkly = { sdkKey: environmentVariables.LAUNCH_DARKLY_SDK_KEY };

const vendasta = {
  apiKey: environmentVariables.VENDASTA_API_KEY,
  apiUser: environmentVariables.VENDASTA_API_USER,
};

const twilio = {
  accountSid:
    env === 'test'
      ? environmentVariables.TWILIO_ACCOUNT_SID_TEST
      : environmentVariables.TWILIO_ACCOUNT_SID || 'ACe874663202cfbbaec4be1ba33869f421',
  authToken:
    env === 'test'
      ? environmentVariables.TWILIO_AUTH_TOKEN_TEST
      : environmentVariables.TWILIO_AUTH_TOKEN || 'ed5dbadfe331c9bf5898f679a8831b23',
  phoneNumber:
    env === 'test' ? environmentVariables.TWILIO_NUMBER_TEST : environmentVariables.TWILIO_NUMBER,
};

const mandrill = { apiKey: environmentVariables.MANDRILL_API_KEY };

const bitly = {
  accessToken: environmentVariables.BITLY_ACCESS_TOKEN,
  shortDomain: environmentVariables.BITLY_SHORT_DOMAIN,
};

const rebrandly = {
  apiKey: environmentVariables.REBRANDLY_API_KEY,
  shortDomain: environmentVariables.REBRANDLY_SHORT_DOMAIN,
};

const loader = { token: environmentVariables.LOADERIO };

const logrocket = { appId: environmentVariables.LOGROCKET_APP_ID };

const intercom = { appId: environmentVariables.INTERCOM_APP_ID };

const aws = {
  accessKeyId: environmentVariables.AWS_ACCESS_KEY_ID,
  secretAccessKey: environmentVariables.AWS_SECRET_ACCESS_KEY,
};

const s3 = { bucket: environmentVariables.S3_BUCKET || 'carecru-development' };

s3.urlPrefix = environmentVariables.S3_URL_PREFIX || `https://${s3.bucket}.s3.amazonaws.com/`;

// For Codeship, use these envs if defined!
const pgUser = environmentVariables.PGUSER;
const pgPassword = environmentVariables.PGPASSWORD;

// Postgres config
const postgres = {
  host: environmentVariables.POSTGRESQL_HOST || 'localhost',
  port: environmentVariables.POSTGRESQL_PORT || 5432,
  username: pgUser || (environmentVariables.POSTGRESQL_USER || 'admin'),
  password: pgPassword || (environmentVariables.POSTGRESQL_PASSWORD || ''),
  database:
    env === 'test' ? defaultDBName : environmentVariables.POSTGRESQL_DATABASE || defaultDBName,
  ssl: !!environmentVariables.POSTGRESQL_SSL,
  logging: !!environmentVariables.POSTGRESQL_LOGGING,
};

const reminders = {
  cronIntervalMinutes: 5,
  sameDayWindowHours: 6,
  allowedCustomConfirmKeys: ['isPreConfirmed', 'reason'],
  get: value => reminders[value],
  set: (key, value) => {
    reminders[key] = value;
  },
};

const reviews = {
  cronIntervalMinutes: 5,
  sameDayWindowHours: 6,
  lastSentReviewInterval: '4 weeks',
};

const recalls = {
  cronIntervalMinutes: 5,
  cronHour: 17,
  cronMinute: 0,
};

const staticPath = path.normalize(path.join(root, '../statics'));
const assetsPath = path.normalize(path.join(root, '../node_modules/@carecru/carecru'));

const logger = { logLevel: environmentVariables.LOG_LEVEL || 'debug' };

// Auth service config
const authHostname = environmentVariables.AUTH_SERVICE_HOST;
const authPort = environmentVariables.AUTH_SERVICE_PORT;
const authCarecruAppId = environmentVariables.AUTH_SERVICE_CARECRU_APP_ID;
const authCarecruApiKey = environmentVariables.AUTH_SERVICE_CARECRU_API_KEY;

const authService = {
  host: authHostname || '127.0.0.1',
  port: authPort || 3000,
  appId: authCarecruAppId || '8ce0bb76-1eff-472e-a643-4f0010d2fa7c',
  apiKey: authCarecruApiKey || 'jNNA7IQKWRqKrH37WYMIBOGC5NgjCPGSYa9O4PEWGOWFGalHV6kRZY9iVpZrIoJ3',
};

const NUM_DAYS_DEFAULT = 2;

module.exports = {
  staticPath,
  assetsPath,
  root,
  tokenSecret,
  tokenExpiry,
  passwordHashSaltRounds,
  environmentVariables,

  // Parsed from environment variables
  env,
  port,
  host,
  myHost,
  protocol,
  fullHostUrl,
  graphQLServerUrl,
  bundlePort,
  caCert,
  redis,
  rabbit: environmentVariables.RABBITMQ_URL
    ? `${environmentVariables.RABBITMQ_URL}?heartbeat=380`
    : rabbit,
  stubEventsService,
  launchDarkly,
  vendasta,
  twilio,
  mandrill,
  namespaces,
  loader,
  logrocket,
  intercom,
  aws,
  s3,
  postgres,
  modeAnalytics,
  callrails,
  reminders,
  reviews,
  recalls,
  bitly,
  rebrandly,
  logger,
  authService,
  apiServerUrl,
  NUM_DAYS_DEFAULT,
  newApiUrl,
};
