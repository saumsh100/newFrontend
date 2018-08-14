
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import withTimer from './withTimer';

function BasicTimer({ totalSeconds, secondsLeft }) {
  return (
    <div>
      <div>Total Seconds: {totalSeconds}</div>
      <div>Seconds Left: {secondsLeft}</div>
    </div>
  );
}

const EnhancedBasicTimer = withTimer(BasicTimer);

storiesOf('withTimer', module)
  .addDecorator(withKnobs)
  .add('simply display enhanced props', () => (
    <EnhancedBasicTimer
      totalSeconds={10}
      secondsLeft={10}
      onStart={action('onStart')}
      onEnd={action('onEnd')}
    />
  ));
