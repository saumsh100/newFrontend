const fs = require('fs');
const cmd = require('shelljs');

(() => {
  try {
    // it builds both dashboard and booking widget
    cmd.exec('npm run client:build');

    // eslint-disable-next-line no-unused-vars
    const { scripts, dependencies, devDependencies, ...basePackage } = JSON.parse(
      fs.readFileSync('package.json'),
    );

    const fileContent = JSON.stringify(basePackage, null, 2);

    const serverPath = 'client/build/';
    fs.writeFileSync(`./${serverPath}package.json`, fileContent);

    cmd.cd(serverPath);
    cmd.exec('npm publish . --access private');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
})();
