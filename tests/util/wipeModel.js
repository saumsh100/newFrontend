
import clone from 'lodash/clone';
import * as Models from '../../server/_models';

async function wipeModel(Model) {
  await Model.destroy({
    where: {},
    force: true,
  });
}

// The model gets wiped in the reverse order
// IE the last in the array gets wiped first.
const ORDER = [
  'Enterprise',
  'WeeklySchedule',
  'Address',
  'Account',
  'Chair',
  'Permission',
  'User',
  'AuthSession',
  'Invite',
  'PatientUser',
  'Family',
  'Patient',
  'Service',
  'Practitioner',
  'Practitioner_Service',
  'PractitionerRecurringTimeOff',
  'DailySchedule',
  'Appointment',
  'PatientRecall',
  'Request',
  'Recall',
  'Reminder',
  'SentRecall',
  'SentReminder',
  'SentRemindersPatients',
  'SentReview',
  'Review',
  'SyncClientError',
  'SyncClientVersion',
  'Token',
  'WaitSpot',
  'Segment',
  'Chat',
  'TextMessage',
  'Call',
  'PinCode',
  'PasswordReset',
  'DeliveredProcedure',
  'AccountTemplate',
  'Template',
  "PatientSearches",
];

async function wipeAllModels() {
  const reversedOrder = clone(ORDER).reverse();
  for (const modelName of reversedOrder) {
    await wipeModel(Models[modelName]);
  }
}

export default wipeModel;
export { wipeAllModels };
