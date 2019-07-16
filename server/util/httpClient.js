
import axios from 'axios';

/**
 * Http Client for the server side
 * @param url host to proxy to
 * @param headers (HTTP) of the request
 * @param data to send to another host
 * @return {Promise}
 */
export default ({ url, method, data }) =>
  axios({
    url,
    method,
    data,
  }).catch((err) => {
    throw err;
  });
