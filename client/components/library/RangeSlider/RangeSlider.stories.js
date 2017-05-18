
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, boolean, object } from '@kadira/storybook-addon-knobs';
import RangeSlider from './';


storiesOf('Slider', module)
  .addDecorator(withKnobs)
  .add('Default Slider', () => (
    <RangeSlider
      onChange={action('change')}
    />
  ));
