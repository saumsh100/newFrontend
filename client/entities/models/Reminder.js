
import createModel from '../createModel';

const ReminderSchema = {
  id: null,
  accountId: null,
  primaryType: null,
  lengthSeconds: null,
  isActive: null,
  isDeleted: null,
};

export default class Reminder extends createModel(ReminderSchema) {

}
