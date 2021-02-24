
import createModel from '../createModel';

const AlertsSchema = {
  id: null,
  title: null,
  body: null,
  subText: null,
  type: null,
  time: null,
  sticky: null,
  caller: null,
  clickable: null,
  browserAlert: null,
};

export default class Alerts extends createModel(AlertsSchema, 'Alerts') {}
