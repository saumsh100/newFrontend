import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { render } from 'enzyme';
import configureStore from 'redux-mock-store';
import EnabledFeature from './index';

const initialState = {
  featureFlags: fromJS({
    flags: {
      'availabilities-2.0': true,
      'booking-widget-v2': false,
      'feature-call-tracking': true,
      'feature-revenue-card': true,
    },
  }),
  auth: fromJS({
    adapterPermissions: {
      'can-add-patient': true,
      'can-update-appointment': false,
      'can-set-ismissing': true,
    },
    role: 'SUPERADMIN',
  }),
};

const mockStore = configureStore();

let wrapper;
let store;

const ToBeEnabledComponent = ({ displayText, userRole }) => (
  <h1 style={{ color: 'green' }}>
    {`I am enabled${displayText && userRole ? ` for user role ${userRole}` : ''}`}
  </h1>
);

ToBeEnabledComponent.propTypes = {
  displayText: PropTypes.bool,
  userRole: PropTypes.string,
};

ToBeEnabledComponent.defaultProps = {
  displayText: false,
  userRole: null,
};

const FallbackComponent = () => <h1 style={{ color: 'red' }}>I am disabled</h1>;

describe('EnabledFeature component', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders properly for feature flags', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ flags }) => flags.get('feature-revenue-card')}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');

    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ flags }) => !flags.get('feature-revenue-card')}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am disabled');
  });

  test('renders properly for adapterPermissions', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ adapterPermissions }) => adapterPermissions.get('can-add-patient')}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');

    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ adapterPermissions }) => !adapterPermissions.get('can-add-patient')}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am disabled');
  });

  test('renders properly for user role', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ userRole }) => userRole === 'SUPERADMIN'}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');

    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ userRole }) => userRole !== 'SUPERADMIN'}
        render={<ToBeEnabledComponent />}
        fallback={<FallbackComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am disabled');
  });

  test('renders if all criteria are met', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ flags, adapterPermissions, userRole }) =>
          flags.get('feature-revenue-card') &&
          adapterPermissions.get('can-add-patient') &&
          userRole === 'SUPERADMIN'
        }
        render={<ToBeEnabledComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');
  });

  test('renders if any criteria are met', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ flags, adapterPermissions, userRole }) =>
          flags.get('booking-widget-v2') ||
          adapterPermissions.get('can-update-appointment') ||
          userRole === 'SUPERADMIN'
        }
        render={<ToBeEnabledComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');
  });

  test('can override redux store values', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ flags, adapterPermissions, userRole }) =>
          flags.get('booking-widget-v2') &&
          adapterPermissions.get('can-update-appointment') &&
          userRole === 'MANAGER'
        }
        flags={fromJS({
          'booking-widget-v2': true,
        })}
        adapterPermissions={fromJS({
          'can-update-appointment': true,
        })}
        userRole="MANAGER"
        render={<ToBeEnabledComponent />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled');
  });

  test('rendered component have access to the props', () => {
    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ userRole }) => userRole === 'SUPERADMIN'}
        render={<ToBeEnabledComponent displayText />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled for user role SUPERADMIN');

    wrapper = render(
      <EnabledFeature
        store={store}
        predicate={({ userRole }) => userRole === 'SUPERADMIN'}
        render={({ userRole }) => <ToBeEnabledComponent displayText userRole={userRole} />}
      />,
    );
    expect(wrapper.text()).toBe('I am enabled for user role SUPERADMIN');
  });
});
