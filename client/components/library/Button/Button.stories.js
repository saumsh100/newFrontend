
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import Button from './';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text default', () => (
    <Button
      onClick={action('clicked')}
    >
      Hello Button
    </Button>
  ))
  .add('with icon ?', () => (
    <Button
      icon="save"
      onClick={action('clicked')}
    >
      Test
    </Button>
  ))
  .add('disabled button', () => (
    <Button
      disabled={boolean('Disabled', true)}
      onClick={action('clicked')}
    >
      Test
    </Button>
  ))
  .add('flat button', () => (
    <Button
      onClick={action('clicked')}
      flat
    >
      Test
    </Button>
  ))
  .add('raised button', () => (
    <Button
      onClick={action('clicked')}
      raised
    >
      Test
    </Button>
  ));

