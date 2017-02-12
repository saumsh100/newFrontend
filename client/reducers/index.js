
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
export default combineReducers({
  routing,
  form,
  toolbar,
  reputation,
  reviews,
  auth,
  entities,
  date,
  schedule,
  currentDialog: dialogs,
  patientList: patientList,
});
