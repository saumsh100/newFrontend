module.exports = {
  testURL: 'http://localhost/',
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/util/jestSetup.js'],
  displayName: 'test',
  moduleNameMapper: {
    '^CareCruModels$': '<rootDir>/server/_models/index.js',
    '^CareCruGraphQL/(.*)': '<rootDir>/server/graphql/$1',
    '\\.(s?css)$': 'identity-obj-proxy',
  },
};
