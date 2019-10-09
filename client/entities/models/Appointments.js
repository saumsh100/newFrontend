
import createModel from '../createModel';

const AppointmentsSchema = {
  reason: null,
  startDate: null,
  endDate: null,
  id: null,
  accountId: null,
  patientId: null,
  serviceId: null,
  practitionerId: null,
  chairId: null,
  isPatientConfirmed: null,
  note: null,
  customBufferTime: null,
  isDeleted: null,
  isCancelled: null,
  isSyncedWithPms: null,
  isPending: null,
  isSplit: null,
  isReminderSent: null,
  mark: null,
  createdAt: null,
};

export default class Appointments extends createModel(AppointmentsSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return `/api/appointments/${this.getId()}`;
  }

  static getCommonSearchAppointmentSchema(options = {}) {
    return {
      isCancelled: false,
      isDeleted: false,
      isMissed: false,
      isPending: false,
      practitionerId: { $not: null },
      chairId: { $not: null },
      ...options,
    };
  }
}
