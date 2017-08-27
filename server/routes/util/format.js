
import { JSONAPI } from '../../middleware/getResponseConfig';
import jsonapi from './jsonapi';
import normalize from '../_api/normalize';

const pluralToSingularMap = {
  appointments: 'appointment',
  chairs: 'chair',
  patients: 'patient',
  practitioners: 'practitioner',
  services: 'service',
};

export default function format(req, res, resourceName, dataArray) {
  if (req.responseConfig.type === JSONAPI) {
    resourceName = (pluralToSingularMap[resourceName]) ? pluralToSingularMap[resourceName]
      : resourceName;
    return jsonapi(resourceName, dataArray);
  }

  return normalize(resourceName, dataArray);
}
