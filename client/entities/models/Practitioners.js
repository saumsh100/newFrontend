import createModel from '../createModel';

const PractitionerSchema = {
  id: null,
  accountId: null,
  services: null,
  firstName: null,
  lastName: null,
  isCustomSchedule: null,
  weeklyScheduleId: null,
};

export default class Practitioner extends createModel(PractitionerSchema) {

  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getUrlRoot() {
    return `/api/practitioners/${this.getId()}`;
  }
}
