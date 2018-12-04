
import createModel from '../createModel';

const generateFullName = (firstName = '', lastName = '') => {
  if (!firstName && !lastName) {
    return 'Unknown Provider';
  }
  return `${firstName || ''} ${lastName || ''}`.trim();
};

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
  isActive: null,
  type: null,
  isHidden: null,
};

export default class Practitioner extends createModel(PractitionerSchema) {
  getFullName() {
    return generateFullName(this.get('firstName'), this.get('lastName'));
  }

  getPrettyName() {
    const name = this.getFullName();
    if (this.get('type') === 'Dentist') {
      return `Dr. ${name}`;
    }

    return name;
  }

  getPrettyShortName() {
    if (this.get('type') === 'Dentist') {
      return `Dr. ${this.get('lastName') || this.get('firstName')}`;
    }
    return this.get('firstName');
  }

  getUrlRoot() {
    return `/api/practitioners/${this.getId()}`;
  }
}
