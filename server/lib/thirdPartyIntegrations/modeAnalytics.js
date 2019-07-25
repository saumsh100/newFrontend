
import crypto from 'crypto';

/**
 * Returns a URL with a timestamp and signature appended to it
 * @param {string} url - Url to be signed
 * @param {string} method - POST, GET, etc.
 * @param {string} key - Access key to use for signing
 * @param {string} secret - Secret to use for signing
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - The signed Url
 */
export default function signUrl({ url, method = 'GET', key, secret, timestamp }) {
  if (url === null || key === null || secret === null || timestamp === null) {
    throw new Error('Function parameter missing');
  }

  if (typeof url !== 'string' || typeof method !== 'string' || typeof key !== 'string' || typeof secret !== 'string') {
    throw new Error('Function parameter invalid');
  }

  if (typeof timestamp !== 'number') {
    throw new Error('Timestamp provided is not numeric');
  }
  const encodedUrl = url.replace(/\[/g, encodeURIComponent('[')).replace(/]/g, encodeURIComponent(']'));
  const contentType = null;
  const contentBody = '';
  const contentDigest = crypto.createHash('md5').update(contentBody).digest().toString('base64');
  const returnUrl = `${encodedUrl}&timestamp=${timestamp}`;
  const requestString = [method, contentType, contentDigest, returnUrl, timestamp].join(',');
  const signature = crypto.createHmac('sha256', secret).update(requestString).digest('hex');

  return `${returnUrl}&signature=${signature}`;
}
