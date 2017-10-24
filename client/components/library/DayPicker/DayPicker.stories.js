
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

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
  ));
  /*.add('Mutiple Days', () => (
    <DayPicker
      multiple
      target="icon"
      onChange={action('changed')}
    />
  ));*/
