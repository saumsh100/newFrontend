
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';
import mapValues from 'lodash/mapValues';
import auth from './patientAuth';
import availabilities, { createInitialWidgetState } from './availabilities';
import entities, { createInitialEntitiesState } from './entities';
import featureFlags from './featureFlags';
import widgetNavigation from './widgetNavigation';
import reviews, { createInitialReviewsState } from './reviewsWidget';

export default history =>
  combineReducers({
    auth,
    availabilities,
    entities,
    featureFlags,
    form,
    reviews,
    router: connectRouter(history),
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
