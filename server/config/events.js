
import logger from '../config/logger';
import { rabbit, stubEventsService } from '../config/globals';

let EventsService;
if (!stubEventsService) {
  const Rabbit = require('rabbit.js');
  EventsService = Rabbit.createContext(rabbit);
} else {
  // Stub the entire Rabbit library
  EventsService = {
    on(status) {
      logger.info(`StubbedEventsService: '${status}' event fired`);
    },

    socket(type) {
      logger.info(`StubbedEventsService: socket connection of type=${type}`);
      return {
        connect(name) {
          logger.info(`StubbedEventsService: Connecting to ${name}`);
        },

        publish(eventName, data) {
          logger.info(`StubbedEventsService: Publishing ${eventName} with data=${data}`);
        },
      };
    },
  };
}

export default EventsService;
