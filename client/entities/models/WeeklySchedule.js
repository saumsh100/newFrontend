
import createModel from '../createModel';

const WeeklyScheduleSchema = {
  id: null,
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
  startDate: null,
  weeklySchedules: [],
  isAdvanced: null,
};

export default class WeeklySchedule extends createModel(WeeklyScheduleSchema, 'WeeklySchedule') {
  getUrlRoot() {
    return `/api/weeklySchedules/${this.getId()}`;
  }
}
