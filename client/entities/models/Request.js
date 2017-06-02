
import moment from 'moment';
import createModel from '../createModel';

const RequestsSchema = {
  startDate: null,
  endDate: null,
  id: null,
  accountId: null,
  patientId: null,
  serviceId: null,
  practitionerId: null,
  chairId: null,
  note: null,
  isCancelled: null,
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
    const startHourMinute = moment(this.get('startDate')).format('h:mm');
    const endHourMinute = moment(this.get('endDate')).format('h:mm a');
    return startHourMinute.concat('-', endHourMinute);
  }

  getMonth() {
    return moment(this.get('startDate')).format('MMM');
  }

  getDay() {
    return moment(this.get('startDate')).date();
  }
}
