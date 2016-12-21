
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './reviews';
import entities from './entities';
import patientForm from './patientForm';

export default combineReducers({
  routing,
  form,
  patientForm,
  // Written by us...
  toolbar,
  reputation,
  reviews,
  entities,
});
