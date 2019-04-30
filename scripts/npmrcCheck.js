
const fs = require('fs');

const run = () => {
  const path = '.npmrc';

  if (fs.existsSync(path)) process.exit(0);

  console.error('\n\n\n/==========================================================/');
  console.error('/ The .npmrc file is needed, please provide it to continue /');
  console.error('/==========================================================/\n\n\n');

  process.exit(1);
};

run();
