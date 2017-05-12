
import React, { Component, PropTypes } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs } from '@kadira/storybook-addon-knobs';
import Timer from './';

storiesOf('Timer', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Timer
      totalSeconds={60}
      onStart={action('onStart')}
      onEnd={action('onEnd')}
    />
  ));
