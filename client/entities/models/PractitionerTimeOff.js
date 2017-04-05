import createModel from '../createModel';

const PractitionerTimeOffSchema = {
  id: null,
  practitionerId: null,
  startDate: null,
  endDate: null,
};

export default class PractitionerTimeOff extends createModel(PractitionerTimeOffSchema) {
  getUrlRoot() {
    return `/api/timeOffs/${this.get('id')}`;
  }
}
