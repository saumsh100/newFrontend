const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  testMatch: [
    "<rootDir>/tests/__tests__/lib/**/*.[jt]s?(x)",
    "<rootDir>/server/lib/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};
