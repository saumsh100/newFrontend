
import createModel from '../createModel';

const PractitionerTimeOffSchema = {
  id: null,
  practitionerId: null,
  startDate: null,
  endDate: null,
  allDay: null,
  note: null,
};

export default class PractitionerTimeOff extends createModel(
  PractitionerTimeOffSchema,
  'PractitionerTimeOff',
) {
  getUrlRoot() {
    return `/api/timeOffs/${this.get('id')}`;
  }
}
