
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
  'SyncClientError',
  'SyncClientVersion',
  'Token',
  'WaitSpot',
  'Chat',
  'TextMessage',
  'Call',
  'PinCode',
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
