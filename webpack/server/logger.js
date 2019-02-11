const {Logger, transports} = require( 'winston' );
const tsFormat = () => `[${(new Date()).toISOString()}]`;
const logger = new Logger({
  transports: [
    // colorize the output to the console
    new transports.Console({ 
      timestamp: tsFormat,
      colorize: true
    })
  ]
})

module.exports = logger;
