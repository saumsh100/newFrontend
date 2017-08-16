
import createSocketServer from '../sockets/createSocketServer';
import createRabbitSub from '../lib/events';

const rabbitjs = require('rabbit.js');
const { urlRabbit } = require('../config/globals');

global.io = createSocketServer();

const context = rabbitjs.createContext(urlRabbit);

createRabbitSub(context, global.io);
