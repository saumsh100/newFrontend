
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean } from '@kadira/storybook-addon-knobs';
import Input from './';

storiesOf('Input', module)
  .add('default with value', () => (
    <Input
      value="text"
      label="Test value"
      onChange={action('change')}
    />
  ))
  .add('disabled input', () => (
    <Input
      value="text"
      label="Test value"
      disabled={boolean('Disabled', true)}
      onChange={action('disabled')}
    />
  ))
  .add('empty value', () => (
    <Input
      value=""
      label="Test value"
      onChange={action('change')}
    />
  ))
  .add('without props', () => (
    <Input />
  ));
