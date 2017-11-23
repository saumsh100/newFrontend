
import clone from 'lodash/clone';
import * as Models from '../../server/_models';

async function wipeModel(Model) {
  await Model.destroy({
    where: {},
    force: true,
  });
}

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
  'Appointment',
  'Request',
  'Recall',
  'Reminder',
  'SentRecall',
  'SentReminder',
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
];

async function wipeAllModels() {
  const reversedOrder = clone(ORDER).reverse();
  for (const modelName of reversedOrder) {
    await wipeModel(Models[modelName]);
  }
}

export default wipeModel;
export {
  wipeAllModels,
};
