
import axios from 'axios';
import omit from 'lodash/omit';

/**
 * Http Client for the server side
 * @param url host to proxy to
 * @param headers (HTTP) of the request
 * @param method (HTTP) of the request
 * @param data to send to another host
 * @return {Promise}
 */
export default ({ url, method, headers, data }) =>
  axios({
    url,
    method,
    headers: omit(headers, ['host']),
    data,
    validateStatus: status => status < 400,
  }).catch((err) => {
    console.error('Proxy Client Error:', err.status, err.message);
    throw err;
  });
