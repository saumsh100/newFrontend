
import createCollection from '../createCollection';
import PractitionerRecurringTimeOff from '../models/PractitionerRecurringTimeOff';

export default class PractitionerRecurringTimeOffs extends createCollection(
  PractitionerRecurringTimeOff,
) {
  getUrlRoot() {
    return '/api/recurringTimeOffs';
  }
}
