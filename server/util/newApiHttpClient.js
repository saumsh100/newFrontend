
import { Deserializer } from 'jsonapi-serializer';
import httpClient from './httpClient';
import { newApiUrl } from '../config/globals';

/**
 * Http Client for new API, appends /api to all requests and always deserialize the response
 * @param url host to proxy to
 * @param method
 * @param params
 * @param data to send to another host
 * @param baseUrl defines the base url for the requests
 * @return {Promise}
 */
export default ({ url, method, params, data }, baseUrl = `${newApiUrl}/api`) =>
  httpClient({
    url: baseUrl + url,
    method,
    params,
    data,
  }).then(({ data: d }) => new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(d));
