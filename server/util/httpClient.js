
import axios from 'axios';

/**
 * Http Client for the server side
 * @param url host to proxy to
 * @method method (HTTP) of the request
 * @param data to send to another host
 * @return {Promise}
 */
export default (url, method, data) =>
  axios({
    url,
    method,
    data,
  }).catch((err) => {
    console.error('Proxy Client Error:', err);
    throw err;
  });
