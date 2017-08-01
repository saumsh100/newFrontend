
import StatusError from '../util/StatusError';
import  {
  Account,
  Appointment,
  Call,
  Chair,
  Chat,
  Enterprise,
  Family,
  Invite,
  Patient,
  PatientUser,
  Permission,
  PinCode,
  Practitioner,
  Practitioner_Service,
  Recall,
  Reminder,
  Request,
  SentRecall,
  SentReminder,
  Service,
  SyncClientError,
  TextMessage,
  User,
  WaitSpot,
  WeeklySchedule,
} from '../_models';

const JOIN_MAP = {
  // Models (singleFetch/findOne)
  account: { model: Account, as: 'account' },
  appointment: { model: Appointment, as: 'appointment' },
  chair: { model: Chair, as: 'chair' },
  chat: { model: Chat, as: 'chat' },
  enterprise: { model: Enterprise, as: 'enterprise' },
  invite: { model: Invite, as: 'invite' },
  patient: { model: Patient, as: 'patient' },
  family: { model: Family, as: 'family' },
  request: { model: Request, as: 'request' },
  service: { model: Service, as: 'service' },
  textMessage: { model: TextMessage, as: 'textMessage' },
  user: { model: User, as: 'user' },
  patientUser: { model: PatientUser, as: 'patientUser' },
  permission: { model: Permission, as: 'permission' },
  practitioner: { model: Practitioner, as: 'practitioner' },
  // TODO: add this when Kirat pushes
  // practitionerTimeOff: { model: PractitionerTimeOff, as: 'practitionerTimeOff' },
  syncClientError: { model: SyncClientError, as: 'syncClientError' },
  reminder: { model: Reminder, as: 'reminder' },
  recall: { model: Recall, as: 'recall' },
  waitSpot: { model: WaitSpot, as: 'waitSpot' },
  weeklySchedule: { model: WeeklySchedule, as: 'weeklySchedule' },
  sentReminder: { model: SentReminder, as: 'sentReminder' },
  sentRecall: { model: SentRecall, as: 'sentRecall' },

  // Collections (list/find)
  accounts: { model: Account, as: 'accounts' },
  appointments: { model: Appointment, as: 'appointments' },
  chairs: { model: Chair, as: 'chairs' },
  chats: { model: Chat, as: 'chats' },
  enterprises: { model: Enterprise, as: 'enterprises' },
  invites: { model: Invite, as: 'invites' },
  patients: { model: Patient, as: 'patients' },
  families: { model: Family, as: 'families' },
  requests: { model: Request, as: 'requests' },
  services: { model: Service, as: 'services' },
  textMessages: { model: TextMessage, as: 'textMessages' },
  users: { model: User, as: 'users' },
  patientUsers: { model: PatientUser, as: 'patientUsers' },
  permissions: { model: Permission, as: 'permissions' },
  practitioners: { model: Practitioner, as: 'practitioners' },
  // TODO: add this when Kirat pushes
  // practitionerTimeOffs: { model: PractitionerTimeOff, as: 'practitionerTimeOffs' },
  syncClientErrors: { model: SyncClientError, as: 'syncClientErrors' },
  reminders: { model: Reminder, as: 'reminders' },
  recalls: { model: Recall, as: 'recalls' },
  waitSpots: { model: WaitSpot, as: 'waitSpots' },
  weeklySchedules: { model: WeeklySchedule, as: 'weeklySchedules' },
  sentReminders: { model: SentReminder, as: 'sentReminders' },
  sentRecalls: { model: SentRecall, as: 'sentRecalls' },
};

export default function createJoinObject(req, res, next) {
  req.joinObject = {};
  req.includeArray = [];
  if (!req.query || !req.query.join) {
    return next();
  }

  const joinStrings = req.query.join.split(',');
  for (const joinString of joinStrings) {
    req.joinObject[joinString] = true;

    const joinData = JOIN_MAP[joinString];
    if (!joinData) {
      return next(StatusError(400, `join query references a relationship that does not exist in JOIN_MAP: ${joinString}`));
    }

    req.includeArray.push(joinData);
  }

  next();
}
