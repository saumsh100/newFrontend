
import React from 'react';
import { storiesOf, action, boolean } from '@kadira/storybook';
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
      disabled
    />
  ));
