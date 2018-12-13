
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import accountSettings from './accountSettings';
import alerts from './alerts';
import apiRequests from './apiRequests';
import auth from './auth';
import availabilities from './availabilities';
import caller from './caller';
import chat from './chat';
import dashboard from './dashboard';
import dialogs from './dialogs';
import electron from './electron';
import entities from './entities';
import featureFlags from './featureFlags';
import intelligence from './intelligence';
import patientList from './patientList';
import patientTable from './patientTable';
import reputation from './reputation';
import requests from './requests';
import schedule from './schedule';
import reviews from './vendastaReviews';
import segments from './segments';
import toolbar from './toolbar';

const appReducer = combineReducers({
  accountSettings,
  alerts,
  apiRequests,
  auth,
  availabilities,
  caller,
  chat,
  currentDialog: dialogs,
  dashboard,
  electron,
  entities,
  featureFlags,
  form,
  intelligence,
  patientList,
  patientTable,
  reputation,
  requests,
  reviews,
  routing,
  schedule,
  segments,
  toolbar,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
