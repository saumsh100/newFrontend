
import createModel from '../createModel';
import { getUTCDate, getFormattedDate } from '../../components/library/util/datetime';

const RequestsSchema = {
  createdAt: null,
  startDate: null,
  endDate: null,
  id: null,
  accountId: null,
  serviceId: null,
  practitionerId: null,
  patientUserId: null,
  requestingPatientUserId: null,
  chairId: null,
  note: null,
  insuranceCarrier: null,
  insuranceMemberId: null,
  insuranceGroupId: null,
  isConfirmed: null,
  isCancelled: null,
  sentRecallId: null,
};

export default class Requests extends createModel(RequestsSchema) {
  getUrlRoot() {
    return `/api/requests/${this.get('id')}`;
  }

  getAge(patientBirthday) {
    const currentYear = new Date().getFullYear();
    const birthday = getUTCDate(patientBirthday).year();
    return currentYear - birthday;
  }

  getFormattedTime() {
    const startHourMinute = getFormattedDate(this.get('startDate'), 'h:mm A');
    const endHourMinute = getFormattedDate(this.get('endDate'), 'h:mm A');
    return startHourMinute.concat(' - ', endHourMinute);
  }

  getMonth() {
    return getFormattedDate(this.get('startDate'), 'MMM');
  }

  getDay() {
    return getFormattedDate(this.get('startDate'), 'D');
  }
}
