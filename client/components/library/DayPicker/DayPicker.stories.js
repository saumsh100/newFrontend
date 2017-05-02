
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean } from '@kadira/storybook-addon-knobs';

import DayPicker from './';

storiesOf('DayPicker', module)
  .add('target input ', () => (
    <DayPicker
      onChange={action('changed')}
    />
  ))
  .add('target icon ', () => (
    <DayPicker
      target="icon"
      onChange={action('changed')}
    />
  ));
