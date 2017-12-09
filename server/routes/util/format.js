
import { JSONAPI } from '../../middleware/getResponseConfig';
import jsonapi from './jsonapi';
import normalize from '../_api/normalize';

const pluralToSingularMap = {
  appointments: 'appointment',
  chairs: 'chair',
  correspondences: 'correspondence',
  families: 'family',
  patients: 'patient',
  practitioners: 'practitioner',
  services: 'service',
  requests: 'request',
  deliveredProcedures: 'deliveredProcedure',
  practitionerSchedules: 'practitionerSchedule',
  weeklySchedule: 'weeklySchedule',
  configurations: 'configuration',
  events: 'event',
};

const toNormalize = {
  practitionerSchedules: 'practitionerRecurringTimeOffs',
  practitionerSchedule: 'practitionerRecurringTimeOff',
};

export default function format(req, res, resourceName, dataArray) {
  if (req.responseConfig.type === JSONAPI) {
    resourceName = (pluralToSingularMap[resourceName]) ? pluralToSingularMap[resourceName]
      : resourceName;
    return jsonapi(resourceName, dataArray);
  }

  const name = toNormalize[resourceName] || resourceName;

  return normalize(name, dataArray);
}
