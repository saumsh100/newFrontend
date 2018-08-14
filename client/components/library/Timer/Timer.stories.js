
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
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
