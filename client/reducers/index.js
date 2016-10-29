
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import toolbar from './toolbar';

export default combineReducers({
  toolbar,
  routing,
  form: formReducer,
});
