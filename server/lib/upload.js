const s3 = require('../../../config/s3');
const sharp = require('sharp');
const async = require('async');

function resizeImage(size, buffer) {
  if (size === 'original') {
    return Promise.resolve(buffer);
  }

  return sharp(buffer)
      .resize(size, size)
      .toBuffer();
}

module.exports = function upload(fileKey, data, sizes = [400, 200, 100]) {
  return new Promise((resolve, reject) => {
    async.eachSeries([
      'original',
      ...sizes,
    ], async (size, nextImage) => {
      const resizedImage = await resizeImage(size, data);
      s3.upload({
        Key: fileKey.replace('[size]', size),
        Body: resizedImage,
        ACL: 'public-read',
      }, async (err, response) => {
        console.log(err, response);
        if (err) {
          return reject(err);
        }

        nextImage(response);
      });
    }, async response => resolve(response));
  });
};
