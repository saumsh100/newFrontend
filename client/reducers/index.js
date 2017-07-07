
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import alerts from './alerts';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './reviews';
import auth from './auth';
import entities from './entities';
import schedule from './schedule';
import dialogs from './dialogs';
import patientList from './patientList';
import requests from './requests';
import accountSettings from './accountSettings';
import apiRequests from './apiRequests';

import availabilities from './availabilities';

const appReducer = combineReducers({
  alerts,
  accountSettings,
  routing,
  form,
  toolbar,
  reputation,
  reviews,
  auth,
  entities,
  schedule,
  requests,
  currentDialog: dialogs,
  patientList,
  availabilities,
  apiRequests,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
