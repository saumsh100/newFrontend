
import LDClient from 'ldclient-js';
import { batchActions } from 'redux-batched-actions';
import {
  CONTEXT_FEATURE_FLAGS_CHANGED,
  contextChanged,
  contextSet,
  featureFlagsChanged,
  featureFlagsSet,
  resetState,
} from '../../reducers/featureFlags';

/**
 * Initialize the feature flag client with initial userData
 * The client is store on window object because it needs to be accesible for identify and flush.
 * @param {*} userData
 */
export const initializeFeatureFlags = (userData = { key: 'carecru' }) => (dispatch) => {
  const envKey = process.env.FEATURE_FLAG_KEY;

  if (!envKey) {
    console.error('FEATURE_FLAG_KEY not set');

    return;
  }

  window.LDClient = LDClient.initialize(`${envKey}`, userData);

  dispatch(contextSet(userData));

  window.LDClient.on('ready', () => {
    const flags = window.LDClient.allFlags();
    dispatch(featureFlagsSet(flags));

    window.LDClient.on('change', (newFlags) => {
      const parsedFlags = Object.keys(newFlags).reduce((acc, key) => {
        acc[key] = newFlags[key].current;
        return acc;
      }, {});

      dispatch(featureFlagsChanged(parsedFlags));
    });
  });
};

/**
 * Identify the new user for feature flags and update the store accordingly.
 * @param {*} userData
 */
export const updateFeatureFlagsContext = (userData = { key: 'carecru' }) => (dispatch) => {
  window.LDClient.identify(userData, null, () => {
    const flags = window.LDClient.allFlags();
    dispatch(batchActions(
      [contextChanged(userData), featureFlagsChanged(flags)],
      CONTEXT_FEATURE_FLAGS_CHANGED,
    ));
  });
};

/**
 * Flush out any events left in the feature flag cleint and reset the store to initial state.
 */
export const resetFeatureFlagsState = () => (dispatch) => {
  window.LDClient.flush(() => {
    dispatch(resetState());
  });
};
