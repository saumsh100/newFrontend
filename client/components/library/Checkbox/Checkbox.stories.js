
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean } from '@kadira/storybook-addon-knobs';
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


