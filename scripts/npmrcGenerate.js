
const fs = require('fs');

const run = () => {
  try {
    const { NPM_TOKEN } = process.env;

    if (!NPM_TOKEN) {
      throw new Error('Missing the NPM_TOKEN env var.');
    }

    const path = '.npmrc';

    if (fs.existsSync(path)) {
      console.log('File already exists, no need for creating again.');
      process.exit(0);
    }

    const fileContent = `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`;

    fs.writeFile(path, fileContent, (err) => {
      if (err) throw new Error(err);
      console.log('The .npmrc file was created!');
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
