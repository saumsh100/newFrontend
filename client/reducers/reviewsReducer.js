
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import toolbar from './toolbar';
import auth from './patientAuth';
import availabilities, { createInitialWidgetState } from './availabilities';
import entities, { createInitialEntitiesState } from './entities';

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
  entities: createInitialEntitiesState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => {
    return reducerCreators[key](value);
  });
}
