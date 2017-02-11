
const globals = require('./globals');
const mandrill = require('mandrill-api/mandrill');

module.exports = new mandrill.Mandrill(globals.mandrill.apiKey);
