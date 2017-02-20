
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
  comment: null,
  isCancelled: null,
};

export default class Requests extends createModel(RequestsSchema) {
  /**
   * Add all TextMessage specific member functions here
   */

  getAge(patientBirthday){
    let currentYear =  new Date().getFullYear();
    let birthday =  moment(patientBirthday).year();
    return currentYear - birthday;
  }

  getFormattedTime(){
    let startHourMinute = moment(this.get('startTime')).format("h:mm");
    let endHourMinute = moment(this.get('endTime')).format("h:mm");
    return startHourMinute.concat('-', endHourMinute);
  }

  getMonth(){
    return moment(this.get('startTime')).format("MMM");
  }

  getDay(){
    return moment(this.get('startTime')).date();
  }
}