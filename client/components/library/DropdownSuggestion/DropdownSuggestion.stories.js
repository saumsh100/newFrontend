
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import DropdownSuggestion from './index';

const options = [
  {
    value: 'Ramon Villain Santos',
    label: 'Ramon',
  },
  {
    value: 'Justin Sharp',
    label: 'Justin',
  },
];

const meta = {
  active: false,
  asyncValidating: false,
  autofilled: false,
  dirty: true,
  form: 'NewAppointmentForm',
  invalid: false,
  pristine: false,
  submitting: false,
  submitFailed: false,
  touched: false,
  valid: true,
  visited: false,
};

const input = {
  value: 'Justin Sharp',
  label: 'Justin',
};

const mockValue = 'Justin Sharp';

storiesOf('DropdownSuggestion', module)
  .addDecorator(withKnobs)
  .add('test', () => (
    <DropdownSuggestion
      data-test-id="string"
      onChange={action('changed')}
      label="Teste"
      input={input}
      name="Teste"
      value={mockValue}
      meta={meta}
      options={options}
    />
  ));
