
import createModel from '../createModel';

const ReminderSchema = {
  id: null,
  accountId: null,
  primaryType: null,
  primaryTypes: null,
  lengthSeconds: null,
  isActive: null,
  isDeleted: null,
};

export default class Reminder extends createModel(ReminderSchema) {

}
