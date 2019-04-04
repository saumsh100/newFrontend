
module.exports = {
  projects: [
    {
      testURL: 'http://localhost/',
      setupTestFrameworkScriptFile: '<rootDir>/tests/util/jestSetup.js',
      displayName: 'test',
      moduleNameMapper: {
        '^CareCruModels$': '<rootDir>/server/_models/index.js',
        '^CareCruGraphQL/(.*)': '<rootDir>/server/graphql/$1',
        '\\.(s?css)$': 'identity-obj-proxy',
      },
      globals: {
        S3Logger: () => ({
          info: () => null,
        }),
        CCLogger: {
          info: () => null,
          error: () => null,
        },
      },
    },
    {
      testURL: 'http://localhost/',
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/client/**/*.{js,jsx}'],
    },
  ],
};
