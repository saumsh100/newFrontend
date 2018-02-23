
import rabbitjs from 'rabbit.js';
import createSocketServer from '../sockets/createSocketServer';
import registerEventSubscribers from '../lib/eventSubscribers';

import { rabbit } from '../config/globals';

global.io = createSocketServer();

const context = rabbitjs.createContext(rabbit);

registerEventSubscribers(context, global.io);
