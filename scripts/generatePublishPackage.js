const fs = require('fs');

module.exports = (buildPath) => {
  // eslint-disable-next-line no-unused-vars
  const { scripts, dependencies, devDependencies, ...basePackage } = JSON.parse(
    fs.readFileSync('package.json'),
  );

  const fileContent = JSON.stringify(basePackage, null, 2);
  fs.writeFileSync(`./${buildPath}package.json`, fileContent);
};
