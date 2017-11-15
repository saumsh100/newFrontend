import registerCallsSubscriber from './Calls';
import registerRequestsSubscriber from './Requests';
import registerAppointmentsSubscriber from './Appointments/index';
import registerRemindersSubscriber from './Reminders/index';

export default function registerEventSubscribers(context, io) {
  context.on('ready', () => {
    // Here we'll add more subs for other routes
    registerCallsSubscriber(context, io);
    registerRequestsSubscriber(context, io);
    registerAppointmentsSubscriber(context, io);
    registerRemindersSubscriber(context, io);
  });
}
