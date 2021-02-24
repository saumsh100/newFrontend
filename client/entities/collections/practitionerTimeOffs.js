
import createCollection from '../createCollection';
import PractitionerTimeOffs from '../models/PractitionerTimeOff';

export default class practitionerTimeOffs extends createCollection(PractitionerTimeOffs) {
  getUrlRoot() {
    return '/api/timeOffs';
  }
}
