
import mapKeys from 'lodash/mapKeys';

export function snakeCaseToCamelCase(str) {
  const find = /(\_\w)/g;
  const convert =  matches => matches[1].toUpperCase();
  return str.replace(
    find,
    convert
  );
}

export function convertKeysToCamelCase(obj) {
  return mapKeys(obj, (val, key) => {
    const firstLetter = key.charAt(0).toLowerCase();
    const removedPascal = firstLetter + key.slice(1, key.length);
    return snakeCaseToCamelCase(removedPascal);
  });
}

export function sanitizeTwilioSmsData(twilioData) {
  const cleansedData = convertKeysToCamelCase(twilioData);

  // Easily parse mediaData
  let mediaData = {};
  const numMedia = parseInt(cleansedData.numMedia);
  if (numMedia) {
    for (let i = 0; i < numMedia; i++) {
      mediaData[i] = {
        url: cleansedData[`mediaUrl${i}`],
        contentType: cleansedData[`mediaContentType${i}`],
      };
    }
  }

  return Object.assign({}, cleansedData, {
    id: cleansedData.sid || cleansedData.messageSid,
    mediaData,
  });
}
