
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean, withKnobs } from '@kadira/storybook-addon-knobs';

import Calendar from './';

storiesOf('Calendar', module)
  .addDecorator(withKnobs)
  .add('clickable dates', () => (
    <Calendar
      onClick={action('change')}
    />
  ));
