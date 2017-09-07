
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './auth';
import entities, { createInitialEntitiesState } from './entities';

export default combineReducers({
  routing,
  form,
  auth,
  entities,
});

const reducerCreators = {
  entities: createInitialEntitiesState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => {
    return reducerCreators[key](value);
  });
}
