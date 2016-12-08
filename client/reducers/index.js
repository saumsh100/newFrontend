
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import toolbar from './toolbar';
import reputation from './reputation';
import reviews from './reviews';
import auth from './auth';

export default combineReducers({
  routing,
  form,

  // Written by us...
  toolbar,
  reputation,
  reviews,
  auth,
});
