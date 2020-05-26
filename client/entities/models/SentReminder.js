
import createModel from '../createModel';

const SentReminderSchema = {
  id: null,
  createdAt: null,
  reminderId: null,
  accountId: null,
  isConfirmed: null,
  lengthSeconds: null,
  isSent: null,
  isWaitingRoomEnabled: null,
};

export default class SentReminder extends createModel(SentReminderSchema) {
  getUrlRoot() {
    return `/api/sentReminders/${this.getId()}`;
  }
}
