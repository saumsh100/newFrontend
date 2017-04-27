
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from './';

storiesOf('Button', module)
  .add('with text default', () => (
    <Button
      onClick={action('clicked')}
    >
      Hello Button
    </Button>
  ))
  .add('with icon ?', () => (
    <Button
      icon="arrow-left"
      onClick={action('clicked')}
    >
      Test
    </Button>
  ));
