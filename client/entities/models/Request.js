
import moment from 'moment';
import createModel from '../createModel';

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
    const birthday = moment(patientBirthday).year();
    return currentYear - birthday;
  }

  getFormattedTime() {
    const startHourMinute = moment(this.get('startDate')).format('h:mm A');
    const endHourMinute = moment(this.get('endDate')).format('h:mm A');
    return startHourMinute.concat(' - ', endHourMinute);
  }

  getMonth() {
    return moment(this.get('startDate')).format('MMM');
  }

  getDay() {
    return moment(this.get('startDate')).date();
  }
}
