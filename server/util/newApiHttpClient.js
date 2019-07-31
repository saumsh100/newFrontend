
import { Deserializer } from 'jsonapi-serializer';
import httpClient from './httpClient';
import { newApiUrl } from '../config/globals';

/**
 * Http Client for new API, appends /api to all requests and always deserialize the response
 * @param url host to proxy to
 * @param headers (HTTP) of the request
 * @param data to send to another host
 * @return {Promise}
 */
export default ({ url, method, params, data }) =>
  httpClient({
    url: `${newApiUrl}/api/${url}`,
    method,
    params,
    data,
  }).then(({ data: d }) => new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(d));
