
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
});
