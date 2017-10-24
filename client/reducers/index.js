
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import alerts from './alerts';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './vendastaReviews';
import auth from './auth';
import entities from './entities';
import schedule from './schedule';
import dialogs from './dialogs';
import patientList from './patientList';
import requests from './requests';
import accountSettings from './accountSettings';
import caller from './caller';
import apiRequests from './apiRequests';
import segments from './segments';
import availabilities from './availabilities';
import patientManagement from './patientManagement';

const appReducer = combineReducers({
  alerts,
  caller,
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
  segments,
  patientManagement,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
