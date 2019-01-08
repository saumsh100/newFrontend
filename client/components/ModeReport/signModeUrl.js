
import axios from 'axios';

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
  const orderedParams = Object.keys(parameters).sort();
  const paramsString = orderedParams.reduce(
    (str, paramName) => `${str}&param_${paramName}=${parameters[paramName]}`,
    '',
  );

  // Don't mess with this ordering!
  // Overall alphabetical order needs to be respected
  return `${reportUrl}?access_key=${accessKey}&max_age=${maxAge}${paramsString}`;
}

/**
 * signModeUrl is a function that will return a promise of the actual
 * request to get the signed URL for the Mode Report
 *
 * @param options
 * @return {axios.Promise}
 */
export default function signModeUrl(options) {
  const encodedQuestion = encodeURIComponent('?');
  const encodedAnd = encodeURIComponent('&');
  const reportUrl = buildModeUrl(options)
    .replace(/\?/g, encodedQuestion)
    .replace(/&/g, encodedAnd);
  const signUrl = `/api/analytics/signUrl?url=${reportUrl}`;
  return axios
    .get(signUrl)
    .then(({ data: { url } }) => url)
    .catch((err) => {
      console.error('Error Signing Mode Url:', err);
      throw err;
    });
}
