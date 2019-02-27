const {Logger, transports} = require( 'winston' );
const tsFormat = () => `[${(new Date()).toISOString()}]`;
const CCLogger = new Logger({
  transports: [
    // colorize the output to the console
    new transports.Console({ 
      timestamp: tsFormat,
      colorize: true
    })
  ]
})

module.exports = CCLogger;
