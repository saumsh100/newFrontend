import React from 'react';
import { mount as enzymeMount } from 'enzyme';
import { Provider } from 'react-redux';
import configure from '../../client/store';

function mount(ui, { store = configure() } = {}) {
  return enzymeMount(<Provider store={store}>{ui}</Provider>);
}

export * from 'enzyme';
export { mount };
