
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, boolean, object } from '@kadira/storybook-addon-knobs';
import Input from './';

const style = {
  width: '50%',
};

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .add('default with value, 50% width', () => (
    <Input
      value="text"
      label="Test value"
      onChange={action('change')}
      style={object('Style', style)}
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
