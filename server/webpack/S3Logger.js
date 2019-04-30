
import { Logger, transports } from 'winston';
import { S3StreamLogger } from 's3-streamlogger';
import CCLogger from './CCLogger';

const loggerMap = new Map();

function S3Logger(folderToUse) {
  if (
    process.env.S3_LOGGER_ENABLED !== 'true' ||
    process.env.S3_LOGS_BUCKET_NAME === undefined ||
    process.env.S3_LOGS_BUCKET_NAME === ''
  ) {
    return CCLogger;
  }

  if (loggerMap.has(folderToUse)) {
    return loggerMap.get(folderToUse);
  }

  const s3Stream = new S3StreamLogger({
    bucket: process.env.S3_LOGS_BUCKET_NAME,
    folder: folderToUse,
    name_format: '%Y-%m-%d-%H-%M-%S.log',
    rotate_every: 12 * 60 * 60 * 1000,
    max_file_size: 100 * 1024 * 1024 * 1024,
    buffer_size: 100 * 1024,
    upload_every: 1 * 60 * 1000,
    access_key_id: process.env.S3_LOGS_ACCESS_KEY_ID,
    secret_access_key: process.env.S3_LOGS_SECRET_ACCESS_KEY,
  });

  const S3LoggerOutput = new Logger({
    transports: [
      new transports.File({
        stream: s3Stream,
      }),
    ],
  });

  loggerMap.set(folderToUse, S3LoggerOutput);

  return S3LoggerOutput;
}

module.exports = S3Logger;
