
const cmd = require('shelljs');
const generatePublishPackage = require('./generatePublishPackage');

(() => {
  try {
    // it builds both dashboard and booking widget
    cmd.exec('npm run client:build');
    const buildPath = 'client/build/';

    generatePublishPackage(buildPath);

    cmd.cp('.npmrc.example', `${buildPath}.npmrc`);
    cmd.cd(buildPath);
    cmd.exec('npm publish . --access private');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
})();
