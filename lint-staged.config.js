
module.exports = {
  linters: {
    'client/**/*.scss': ['npm run format', 'git add'],
    'client/**/*.{js,jsx}': [
      'npm run format',
      'prettier --write',
      'eslint --fix -c .carecru.eslintrc',
      'git add',
    ],
  },
};
