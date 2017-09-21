
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import Calendar from './';

storiesOf('Calendar', module)
  .addDecorator(withKnobs)
  .add('clickable dates', () => (
    <Calendar
      onClick={action('change')}
    />
  ));
