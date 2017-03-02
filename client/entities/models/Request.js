
import createModel from '../createModel';
import moment from 'moment';


const RequestsSchema = {
  startTime: null,
  endTime: null,
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
    const startHourMinute = moment(this.get('startTime')).format("h:mm");
    const endHourMinute = moment(this.get('endTime')).format("h:mm");
    return startHourMinute.concat('-', endHourMinute);
  }

  getMonth() {
    return moment(this.get('startTime')).format("MMM");
  }

  getDay() {
    return moment(this.get('startTime')).date();
  }
}