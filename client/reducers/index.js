
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import alerts from './alerts';
import toolbar from './toolbar';
import reputation from './reputation';
import dashboard from './dashboard';
import reviews from './vendastaReviews';
import auth from './auth';
import entities from './entities';
import electron from './electron';
import schedule from './schedule';
import dialogs from './dialogs';
import patientList from './patientList';
import patientSearch from './patientSearch';
import chat from './chat';
import requests from './requests';
import accountSettings from './accountSettings';
import caller from './caller';
import apiRequests from './apiRequests';
import segments from './segments';
import availabilities from './availabilities';
import intelligence from './intelligence';
import patientTable from './patientTable';

const appReducer = combineReducers({
  alerts,
  caller,
  accountSettings,
  dashboard,
  routing,
  intelligence,
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
  patientSearch,
  chat,
  availabilities,
  apiRequests,
  segments,
  patientTable,
  electron,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
