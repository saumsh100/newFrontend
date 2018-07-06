
import { fromJS } from 'immutable';
import reducer, {
  initialState,
  featureFlagsSet,
  featureFlagsChanged,
  contextSet,
  contextChanged,
  resetState,
  isFeatureEnabledSelector,
} from './index';

describe('featureFlags reducer', () => {
  const contextSetAction = contextSet({ key: 'carecru' });

  const contextChangedAction = contextChanged({
    firstName: 'Justin',
    lastName: 'Sharp',
    email: 'justin@carecru.com',
    key: '6603fe66-aa03-4ffe-8de6-ce07a4ae9c5c',
    custom: {
      plan: 'GROWTH',
      role: 'SUPERADMIN',
      accountId: '5086adbe-22a9-4b76-981b-b68f0a3d6113',
      enterpriseName: 'Dr. Goers',
      enterpriseId: '906367fd-587a-4209-8022-edc549a3ec7f',
    },
  });

  const featureFlagsSetAction = featureFlagsSet({
    'availabilities-2.0': true,
    'booking-widget-v2': false,
    'feature-call-tracking': true,
    'feature-revenue-card': true,
  });

  const featureFlagsChangedAction = featureFlagsChanged({
    'availabilities-2.0': false,
    'booking-widget-v2': true,
    'feature-call-tracking': false,
    'feature-revenue-card': false,
  });

  const resetStateAction = resetState();

  test('action creator works', () => {
    expect(contextSetAction).toMatchSnapshot();
    expect(contextChangedAction).toMatchSnapshot();
    expect(featureFlagsSetAction).toMatchSnapshot();
    expect(featureFlagsChangedAction).toMatchSnapshot();
    expect(resetStateAction).toMatchSnapshot();
  });

  test('selectors works', () => {
    const flags = fromJS(featureFlagsSetAction.payload);
    expect(isFeatureEnabledSelector(flags, 'availabilities-2.0')).toEqual(true);
    expect(isFeatureEnabledSelector(flags, 'booking-widget-v2')).toEqual(false);
    expect(isFeatureEnabledSelector(flags, 'feature-call-tracking')).toEqual(true);
    expect(isFeatureEnabledSelector(flags, 'feature-revenue-card')).toEqual(true);
  });

  test('reducer works', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
    expect(reducer(initialState, contextSetAction)).toMatchSnapshot();
    expect(reducer(initialState, contextChangedAction)).toMatchSnapshot();
    expect(reducer(initialState, featureFlagsSetAction)).toMatchSnapshot();
    expect(reducer(initialState, featureFlagsChangedAction)).toMatchSnapshot();
    expect(reducer(initialState, resetStateAction)).toMatchSnapshot();
  });
});
