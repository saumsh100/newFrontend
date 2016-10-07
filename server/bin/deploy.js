
/**
 * Bundle the files for production
 */

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const childProcess = require('child_process');
  const configPath = path.join(__dirname, '../config/webpack/webpack.production.config.js');
  childProcess.exec(`webpack -p --config ${configPath}`, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
}
