
/**
 * getParameterByName will parse the window's url for the encoded information
 * in it and decode it and return it
 *
 * @param name
 * @param url
 * @returns {}
 */

export default function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) {
    return '';
  }

  const encodedParams = decodeURIComponent(results[2].replace(/\+/g, ' '));
  const decodedParams = Buffer.from(encodedParams, 'base64').toString('utf8');
  return JSON.parse(decodedParams);
}
