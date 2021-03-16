
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const FEATURE_FLAGS_SET = '@feature-flags/FEATURE_FLAGS_SET';
export const FEATURE_FLAGS_CHANGED = '@feature-flags/FEATURE_FLAGS_CHANGED';
export const CONTEXT_SET = '@feature-flags/CONTEXT_SET';
export const CONTEXT_CHANGED = '@feature-flags/CONTEXT_CHANGED';
export const RESET_STATE = '@feature-flags/RESET_STATE';

export const CONTEXT_FEATURE_FLAGS_CHANGED = '@feature-flags/CONTEXT_FEATURE_FLAGS_CHANGED';

export const featureFlagsSet = createAction(FEATURE_FLAGS_SET);
export const featureFlagsChanged = createAction(FEATURE_FLAGS_CHANGED);
export const contextSet = createAction(CONTEXT_SET);
export const contextChanged = createAction(CONTEXT_CHANGED);
export const resetState = createAction(RESET_STATE);

export const isFeatureEnabledSelector = (features, featureName) =>
  features?.get(featureName) || false;

export const initialState = fromJS({
  flags: {},
  flagsLoaded: false,
  context: {},
});

export default handleActions(
  {
    [FEATURE_FLAGS_SET](state, { payload }) {
      return state.set('flags', fromJS(payload)).set('flagsLoaded', true);
    },

    [FEATURE_FLAGS_CHANGED](state, { payload }) {
      return state.merge({
        flags: state.get('flags').merge(payload),
      });
    },

    [CONTEXT_SET](state, { payload }) {
      return state.set('context', payload);
    },

    [CONTEXT_CHANGED](state, { payload }) {
      return state.set('context', payload);
    },

    [RESET_STATE]() {
      return initialState;
    },
  },
  initialState,
);
