
import createModel from '../createModel';

const RequestsSchema = {
  startTime: null,
  endTime: null,
  title: null,
  id: null,
  accountId: null,
  patientId: null,
  serviceId: null,
  practitionerId: null,
  chairId: null,
  comment: null,
};

export default class Requests extends createModel(RequestsSchema) {
  /**
   * Add all TextMessage specific member functions here
   */

}