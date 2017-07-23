import createModel from '../createModel';

const PractitionerSchema = {
  id: null,
  createdAt: null,
  accountId: null,
  services: [],
  firstName: null,
  lastName: null,
  //type: 'DR',
  isCustomSchedule: null,
  weeklyScheduleId: null,
  fullAvatarUrl: null,
  avatarUrl: null,
  isActive: null,
  type: null,
  isHidden: null,
};

export default class Practitioner extends createModel(PractitionerSchema) {
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getPrettyName() {
    const name = this.getFullName();
    if (this.get('type') === 'Dentist') {
      return `Dr. ${name}`;
    }

    return name;
  }

  getUrlRoot() {
    return `/api/practitioners/${this.getId()}`;
  }
}
