
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './reviews';
import auth from './auth';
import entities from './entities';
import date from './date';
import schedule from './schedule';
import dialogs from './dialogs';
import patientList from './patientList';
import requests from './requests';
import accountSettings from './accountSettings';

import availabilities from './availabilities';

export default combineReducers({
  accountSettings,
  routing,
  form,
  toolbar,
  reputation,
  reviews,
  auth,
  entities,
  date,
  schedule,
  requests,
  currentDialog: dialogs,
  patientList: patientList,
  availabilities,
});
