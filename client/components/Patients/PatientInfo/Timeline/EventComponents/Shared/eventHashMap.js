
import ReviewEvent from '../ReviewEvent';
import ReminderEvent from '../ReminderEvent';
import CallEvent from '../CallEvent';
import AppointmentEvent from '../AppointmentEvent';
import NewPatientEvent from '../NewPatientEvent';
import NoteEvent from '../NoteEvent';
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
  dueDate: buildEventObj(DueDateEvent, 'calendar-plus', 'blue'),
  newPatient: buildEventObj(NewPatientEvent, 'user', 'green'),
  note: buildEventObj(NoteEvent, 'sticky-note', 'blue', 'solid'),
  recall: buildEventObj(RecallEvent, 'bell', 'red'),
  reminder: buildEventObj(ReminderEvent, 'bell', 'red'),
  request: buildEventObj(RequestEvent, 'calendar-check', 'green'),
  review: buildEventObj(ReviewEvent, 'star', 'yellow'),
};

function setAppointmentIcon({ isCancelled }) {
  return isCancelled ? 'calendar-times' : 'calendar-alt';
}

export default eventHashMap;
