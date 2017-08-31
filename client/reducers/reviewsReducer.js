
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './patientAuth';
import entities, { createInitialEntitiesState } from './entities';
import availabilities, { createInitialWidgetState } from './availabilities';
import reviews, { createInitialReviewsState } from './reviewsWidget';

export default combineReducers({
  routing,
  form,
  auth,
  entities,
  reviews,
  availabilities,
});

const reducerCreators = {
  availabilities: createInitialWidgetState,
  entities: createInitialEntitiesState,
  reviews: createInitialReviewsState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => {
    return reducerCreators[key](value);
  });
}
