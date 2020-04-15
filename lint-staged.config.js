
module.exports = {
  linters: {
    'client/**/*.scss': ['npm run format', 'npm run format:css', 'git add'],
    'client/**/*.{js,jsx}': [
      'npm run format',
      'prettier --write',
      'eslint --fix -c .carecru.eslintrc',
      'git add',
    ],
  },
};
