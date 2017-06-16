const S3 = require('aws-sdk/clients/s3');
const globals = require('./globals');

module.exports = new S3({
  params: {
    Bucket: globals.s3.bucket,
  },
  credentials: {
    accessKeyId: globals.aws.accessKeyId,
    secretAccessKey: globals.aws.secretAccessKey,
  },
})
;
