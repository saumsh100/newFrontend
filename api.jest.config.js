const defaultConfig  = require('./jest.config');

module.exports = {
  ...defaultConfig,
  testMatch: [
    "<rootDir>/tests/__tests__/api/**/*.[jt]s?(x)",
    "<rootDir>/server/routes/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};
