
import createModel from '../createModel';

const EventsSchema = {
  id: null,
  accountId: null,
  patientId: null,
  type: null,
  action: null,
  metaData: null,
};

export default class Events extends createModel(EventsSchema) {

}
