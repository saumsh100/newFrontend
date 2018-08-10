
import React from 'react';
import { fromJS, Map } from 'immutable';
import { render } from 'enzyme';
import moment from 'moment-timezone';
import configureStore from 'redux-mock-store';
import TimezoneFormatter from './index';

const initialState = {
  auth: fromJS({
    timezone: 'America/Edmonton',
  }),
  availabilities: fromJS({
    account: null,
  }),
};

const newState = {
  auth: fromJS({
    timezone: 'America/Edmonton',
  }),
  availabilities: fromJS({
    account: new Map({
      timezone: 'America/Vancouver',
    }),
  }),
};

const mockStore = configureStore();

let wrapper;
let store;

describe('TimezoneFormatter component', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders properly for timezones', () => {
    wrapper = render(<TimezoneFormatter
      store={store}
      date={new Date()}
      format="MMM dd YYYY"
      render={({ timezone }) => <span>{timezone}</span>}
    />);
    expect(wrapper.text()).toBe('America/Edmonton');
  });

  test('renders formatted date properly', () => {
    wrapper = render(<TimezoneFormatter
      store={store}
      date={new Date()}
      format="MMM dd YYYY"
      render={({ formattedDate }) => <span>{formattedDate}</span>}
    />);

    const testDate = moment()
      .tz('America/Edmonton')
      .format('MMM dd YYYY');
    expect(wrapper.text()).toEqual(testDate);
  });

  test('renders with default format', () => {
    wrapper = render(<TimezoneFormatter
      store={store}
      date={new Date()}
      render={({ formattedDate }) => <span>{formattedDate}</span>}
    />);

    const testDate = moment()
      .tz('America/Edmonton')
      .format('LT');
    expect(wrapper.text()).toEqual(testDate);
  });

  test('renders using availabilities timezone', () => {
    const store2 = mockStore(newState);

    wrapper = render(<TimezoneFormatter
      store={store2}
      date={new Date()}
      format="MMM dd YYYY h"
      render={({ formattedDate }) => <span>{formattedDate}</span>}
    />);

    const testDate = moment()
      .tz('America/Vancouver')
      .format('MMM dd YYYY h');
    expect(wrapper.text()).toEqual(testDate);
  });
});
