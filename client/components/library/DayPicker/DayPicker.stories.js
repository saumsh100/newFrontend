
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, object } from '@kadira/storybook-addon-knobs';

import DayPicker from './';

const style = {
  color: 'red',
};

storiesOf('DayPicker', module)
  .addDecorator(withKnobs)
  .add('target input ', () => (
    <DayPicker
      onChange={action('changed')}
      style={object('Style', style)}
    />
  ))
  .add('target icon ', () => (
    <DayPicker
      target="icon"
      onChange={action('changed')}
    />
  ))
  .add('Mutiple Days', () => (
    <DayPicker
      multiple
      target="icon"
      onChange={action('changed')}
    />
  ));
