
import createModel from '../createModel';

const AlertsSchema = {
  id: null,
  title: null,
  body: null,
  type: null,
  time: null,
  sticky: null,
  caller: null,
  browserAlert: null,
};

export default class Alerts extends createModel(AlertsSchema) {

}
