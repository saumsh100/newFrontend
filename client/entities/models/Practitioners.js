import createModel from '../createModel';

const PractitionerSchema = {
  id: null,
  createdAt: null,
  accountId: null,
  services: [],
  firstName: null,
  lastName: null,
  isCustomSchedule: null,
  weeklyScheduleId: null,
  fullAvatarUrl: null,
  avatarUrl: null,
};

export default class Practitioner extends createModel(PractitionerSchema) {

  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getUrlRoot() {
    return `/api/practitioners/${this.getId()}`;
  }
}
