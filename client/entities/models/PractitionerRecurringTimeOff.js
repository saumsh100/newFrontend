
import createModel from '../createModel';

const PractitionerRecurringTimeOffSchema = {
  id: null,
  practitionerId: null,
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  allDay: null,
  fromPMS: null,
  dayOfWeek: null,
  note: null,
  pmsId: null,
  interval: null,
};

export default class PractitionerRecurringTimeOff extends createModel(
  PractitionerRecurringTimeOffSchema,
  'PractitionerRecurringTimeOff',
) {
  getUrlRoot() {
    return `/api/recurringtimeOffs/${this.get('id')}`;
  }
}
