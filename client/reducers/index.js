
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
// import { reducer as form } from 'redux-form';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './reviews';
import auth from './auth';
import entities from './entities';
import patientForm from './patientForm';

export default combineReducers({
  routing,
  form,
  patientForm,
  toolbar,
  reputation,
  reviews,
  auth,
  entities,
});
