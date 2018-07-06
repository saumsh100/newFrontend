
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './auth';
import connect from './connect';
import entities, { createInitialEntitiesState } from './entities';
import featureFlags from './featureFlags';

export default combineReducers({
  auth,
  connect,
  entities,
  featureFlags,
  form,
  routing,
});

const reducerCreators = {
  entities: createInitialEntitiesState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => reducerCreators[key](value));
}
