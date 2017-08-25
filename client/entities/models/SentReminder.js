import createModel from '../createModel';

const SentReminderSchema = {
  id: null,
  createdAt: null,
  //sentDate: null,
  reminderId: null,
  accountId: null,
  patientId: null,
  appointmentId: null,
  isConfirmed: null,
  lengthSeconds: null,
  isSent: null,
};

export default class SentReminder extends createModel(SentReminderSchema) {
  getUrlRoot() {
    return `/api/sentReminders/${this.getId()}`;
  }
}
