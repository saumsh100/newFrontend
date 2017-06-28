const s3 = require('../config/s3');
const sharp = require('sharp');
const async = require('async');

function resizeImage(size, buffer) {
  if (size === 'original') {
    return Promise.resolve(buffer);
  }

  return sharp(buffer)
      .resize(size, size, { withoutEnlargement: false })
      .toBuffer();
}

module.exports = function upload(fileKey, data, sizes = [400, 200, 100]) {
  const responses = [];

  return new Promise((resolve, reject) => {
    if (!fileKey) {
      return reject('fileKey must be set');
    }

    if (!data) {
      return reject('data must be set');
    }

    if (!Array.isArray(sizes)) {
      return reject('sizes must be an array');
    }
    
    const valid = sizes.reduce((prev, curr) => prev && !isNaN(curr), true);

    if (!valid) {
      return reject('sizes should be numeric');
    }

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
        if (err) {
          return reject(err);
        }

        responses.push(response);
        return nextImage(null, response);
      });
    }, async (err) => {
      if (err) {
        return reject(err);
      }
      
      return resolve(responses);
    });
  });
};
