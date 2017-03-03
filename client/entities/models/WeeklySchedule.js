
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
};

export default class WeeklySchedule extends createModel(WeeklyScheduleSchema) {
  getUrlRoot() {
    return `/api/weeklySchedules/${this.getId()}`;
  }
}
