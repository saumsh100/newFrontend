
module.exports = {
  linters: {
    'client/**/*.scss': ['npm run format', 'git add'],
    'client/**/*.{js,jsx}': ['npm run format', 'jest', 'git add'],
  },
};