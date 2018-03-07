
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
  ignoreSendIfConfirmed: null,
};

export default class Reminder extends createModel(ReminderSchema) {

}
