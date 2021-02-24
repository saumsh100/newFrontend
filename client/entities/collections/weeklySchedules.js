
import createCollection from '../createCollection';
import WeeklySchedule from '../models/WeeklySchedule';

export default class weeklySchedules extends createCollection(WeeklySchedule) {
  getUrlRoot() {
    return '/api/weeklySchedules';
  }
}
