
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checkbox from './';

storiesOf('Checkbox', module)
  .add('not checked', () => (
    <Checkbox
      checked={false}
      onChange={action('clicked')}
    />
  ))
  .add('checked', () => (
    <Checkbox
      checked={true}
      onChange={action('clicked')}
    />
  ));


