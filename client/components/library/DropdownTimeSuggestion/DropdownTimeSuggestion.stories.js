
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import moment from 'moment';
import DropdownSuggestion from './index';

const renderTimeValue = (val) => {
  let data;
  if (moment(val, 'LT', true).isValid()) {
    data = val.toUpperCase();
  } else if (moment(val, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()) {
    data = moment(val).format('LT');
  }
  return data;
};

const formatTimeField = (val) => {
  let data;
  if (moment(val, 'LT', true).isValid()) {
    data = moment(`1970-01-31 ${val}`, 'YYYY-MM-DD LT').toISOString();
  } else if (moment(val, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()) {
    data = val;
  }
  return data;
};

const validateTimeField = val =>
  moment(val, ['YYYY-MM-DDTHH:mm:ss.sssZ', 'LT'], true).isValid() &&
  new RegExp('^((0?[0-9]|1[0-2]):[0-5][0-9] ([AP][M]))$', 'i').test(val);

const options = [
  {
    value: '2018-04-05T06:00:00.000Z',
    label: '6:00 AM',
  },
  {
    value: '2018-04-05T12:00:00.000Z',
    label: '12:00 PM',
  },
  {
    value: '2018-04-05T18:00:00.000Z',
    label: '6:00 PM',
  },
  {
    value: '2018-04-05T00:00:00.000Z',
    label: '12:00 AM',
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

const mockValue = '2018-04-05T18:00:00.000Z';

const input = {
  value: '2018-04-05T18:00:00.000Z',
  label: '06:00 PM',
};

storiesOf('DropdownTimeSuggestion', module)
  .addDecorator(withKnobs)
  .add('Strict False', () => (
    <DropdownSuggestion
      data-test-id="string"
      onChange={action('changed')}
      label="Teste"
      name="Teste"
      renderValue={renderTimeValue}
      formatValue={formatTimeField}
      validateValue={validateTimeField}
      input={input}
      strict={false}
      value={mockValue}
      meta={meta}
      options={options}
    />
  ))
  .add('Default', () => (
    <DropdownSuggestion
      data-test-id="string"
      onChange={action('changed')}
      label="Teste"
      name="Teste"
      renderValue={renderTimeValue}
      formatValue={formatTimeField}
      validateValue={validateTimeField}
      input={input}
      value={mockValue}
      meta={meta}
      options={options}
    />
  ));
