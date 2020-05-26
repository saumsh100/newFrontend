
import createModel from '../createModel';

const ReminderSchema = {
  id: null,
  accountId: null,
  primaryTypes: null,
  interval: null,
  isActive: null,
  isDeleted: null,
  isCustomConfirm: null,
  customConfirmData: null,
  isConfirmable: null,
  omitPractitionerIds: null,
  omitChairIds: null,
  ignoreSendIfConfirmed: null,
  isDaily: null,
  dailyRunTime: null,
  dontSendWhenClosed: null,
  startTime: null,
  isBusinessDays: null,
  isWaitingRoomEnabled: null,
};

export default class Reminder extends createModel(ReminderSchema) {}
