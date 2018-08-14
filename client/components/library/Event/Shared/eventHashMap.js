
import ReviewEvent from '../ReviewEvent';
import ReminderEvent from '../ReminderEvent';
import CallEvent from '../CallEvent';
import AppointmentEvent from '../AppointmentEvent';
import NewPatientEvent from '../NewPatientEvent';
import DueDateEvent from '../DueDateEvent';
import RequestEvent from '../RequestEvent';
import RecallEvent from '../RecallEvent';

const buildEventObj = (component, icon, iconColor, iconType) => ({
  component: [component],
  icon: typeof icon === 'function' ? icon : () => icon,
  iconColor,
  iconType,
});

const eventHashMap = {
  appointment: buildEventObj(AppointmentEvent, setAppointmentIcon, 'blue', 'regular'),
  call: buildEventObj(CallEvent, 'phone', 'yellow'),
  duedate: buildEventObj(DueDateEvent, 'bell', 'blue'),
  newpatient: buildEventObj(NewPatientEvent, 'user', 'green'),
  recall: buildEventObj(RecallEvent, setReminderRecallIcon, 'red'),
  reminder: buildEventObj(ReminderEvent, setReminderRecallIcon, 'red'),
  request: buildEventObj(RequestEvent, 'calendar-check', 'green'),
  review: buildEventObj(ReviewEvent, 'star', 'yellow'),
};

function setReminderRecallIcon({ primaryType }) {
  const typeHash = {
    email: 'envelope',
    sms: 'comment',
    'sms/email': 'comments',
  };
  return typeHash[primaryType];
}

function setAppointmentIcon({ isCancelled }) {
  return isCancelled ? 'calendar-times' : 'calendar-alt';
}

export default eventHashMap;
