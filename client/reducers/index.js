import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
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
import intelligenceReports from './intelligenceReports';
import waitingRoom from './waitingRoom';

const rootReducer = (history) =>
  combineReducers({
    accountSettings,
    alerts,
    apiRequests,
    auth,
    availabilities,
    caller,
    chat,
    currentDialog: dialogs,
    dashboard,
    entities,
    featureFlags,
    form,
    intelligence,
    intelligenceReports,
    patientList,
    patientTable,
    reputation,
    requests,
    reviews,
    router: connectRouter(history),
    schedule,
    segments,
    toolbar,
    waitingRoom,
  });

export default rootReducer;
