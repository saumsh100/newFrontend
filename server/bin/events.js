
import EventsService from '../config/events';
import createSocketServer from '../sockets/createSocketServer';
import registerEventSubscribers from '../lib/eventSubscribers';

global.io = createSocketServer();

registerEventSubscribers(EventsService, global.io);
