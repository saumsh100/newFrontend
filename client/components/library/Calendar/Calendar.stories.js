
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean } from '@kadira/storybook-addon-knobs';

import Calendar from './';

storiesOf('Calendar', module)
  .add('clickable dates', () => (
    <Calendar
      onClick={action('change')}
    />
  ));
