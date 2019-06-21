
import queryString from 'query-string';
import { httpClient } from '../../util/httpClient';

const defaultAccessKey = process.env.MODE_ANALYTICS_ACCESS_KEY;
const generateReportUrl = reportId => `https://modeanalytics.com/carecru/reports/${reportId}/embed`;

/**
 * buildModeUrl is a function that will construct the reportUrl that will
 * get fed into an HTTP request
 *
 * @param accessKey
 * @param reportUrl
 * @param reportId
 * @param parameters
 * @param maxAge
 * @return {string}
 */
export function buildModeUrl({
  accessKey = defaultAccessKey,
  reportId,
  reportUrl,
  parameters,
  maxAge = 1600,
}) {
  // Override reportId if entire URL is provided
  reportUrl = reportUrl || generateReportUrl(reportId);

  // Make sure the URL parameters are in alphabetical order
  const orderedParams = Object.keys(parameters)
    .sort()
    .reduce(
      (acc, curr) => ({
        ...acc,
        [`param_${curr}`]: parameters[curr],
      }),
      {},
    );
  const paramsString = queryString.stringify(orderedParams, { arrayFormat: 'bracket' });

  // Don't mess with this ordering!
  // Overall alphabetical order needs to be respected
  return `${reportUrl}?access_key=${accessKey}&max_age=${maxAge}&${paramsString}`;
}

/**
 * signModeUrl is a function that will return a promise of the actual
 * request to get the signed URL for the Mode Report
 *
 * @param options
 * @return {Promise}
 */
export default function signModeUrl(options) {
  const reportUrl = buildModeUrl(options)
    .replace(/\?/g, encodeURIComponent('?'))
    .replace(/&/g, encodeURIComponent('&'))
    .replace(/\[/g, encodeURIComponent('['))
    .replace(/]/g, encodeURIComponent(']'));
  const signUrl = `/api/analytics/signUrl?url=${reportUrl}`;
  return httpClient()
    .get(signUrl)
    .then(({ data: { url } }) => url)
    .catch((err) => {
      console.error('Error Signing Mode Url:', err);
      throw err;
    });
}
