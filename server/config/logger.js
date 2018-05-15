
import winston from 'winston';
import GLOBALS from './globals';

winston.level = GLOBALS.logger.logLevel;
const logger = winston;

export default logger;
