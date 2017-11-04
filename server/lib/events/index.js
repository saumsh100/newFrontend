import registerCallsSubscriber from './Calls';
import registerRequestsSubscriber from './Requests';
import registerPatientsSubscriber from './Patients';

export default function registerEventSubscribers(context, io) {
  context.on('ready', () => {
    // Here we'll add more subs for other routes
    registerCallsSubscriber(context, io);
    registerRequestsSubscriber(context, io);
    registerPatientsSubscriber(context, io);
  });
}
