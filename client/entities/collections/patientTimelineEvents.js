
import createCollection from '../createCollection';
import PatientTimelineEvent from '../models/PatientTimelineEvent';

export default class patientTimelineEvents extends createCollection(PatientTimelineEvent) {
  getUrlRoot() {
    return '/api/events';
  }
}
