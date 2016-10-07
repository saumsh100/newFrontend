
const globals = require('../config/globals');
const app = require('./app');

app.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
});
