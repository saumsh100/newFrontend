import createCollection from '../createCollection';
import SentReminder from '../models/SentReminder';

export default class sentReminders extends createCollection(SentReminder) {
  getUrlRoot() {
    return '/api/sentReminders';
  }
}
