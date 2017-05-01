
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Input from './';

storiesOf('Input', module)
  .add('default with value', () => (
    <Input
      value="text"
      label="Test value"
      onChange={action('change')}
    />
  ));
