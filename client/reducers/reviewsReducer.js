
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './patientAuth';
import availabilities, { createInitialWidgetState } from './availabilities';
import entities, { createInitialEntitiesState } from './entities';
import featureFlags from './featureFlags';
import widgetNavigation from './widgetNavigation';
import reviews, { createInitialReviewsState } from './reviewsWidget';

export default combineReducers({
  auth,
  availabilities,
  entities,
  featureFlags,
  form,
  reviews,
  routing,
  widgetNavigation,
});

const reducerCreators = {
  availabilities: createInitialWidgetState,
  entities: createInitialEntitiesState,
  reviews: createInitialReviewsState,
};

export function createInitialState(initialState) {
  return mapValues(initialState, (value, key) => reducerCreators[key](value));
}
