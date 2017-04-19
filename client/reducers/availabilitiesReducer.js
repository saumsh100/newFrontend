
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import toolbar from './toolbar';
import auth from './auth';
import entities from './entities';
import availabilities, { createInitialWidgetState } from './availabilities';

export default combineReducers({
  routing,
  form,
  toolbar,
  auth,
  entities,
  availabilities,
});

const reducerCreators = {
  availabilities: createInitialWidgetState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => {
    return reducerCreators[key](value);
  });
}
