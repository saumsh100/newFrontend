
import createModel from '../createModel';

const AppointmentsSchema = {
  startDate: null,
  endDate: null,
  id: null,
  accountId: null,
  patientId: null,
  serviceId: null,
  practitionerId: null,
  chairId: null,
  note: null,
};

export default class Appointments extends createModel(AppointmentsSchema) {
  /**
   * Add all TextMessage specific member functions here
   */

}
