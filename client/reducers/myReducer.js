
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './patientAuth';
import alerts from './alerts';
import entities, { createInitialEntitiesState } from './entities';
import featureFlags from './featureFlags';

export default history =>
  combineReducers({
    auth,
    alerts,
    entities,
    featureFlags,
    form,
    router: connectRouter(history),
  });

const reducerCreators = {
  entities: createInitialEntitiesState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => reducerCreators[key](value));
}
