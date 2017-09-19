
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import Toggle from './';

storiesOf('Toggle', module)
  .addDecorator(withKnobs)
  .add('default-checked true', () => (
    <Toggle
      defaultChecked
      onChange={action('clicked')}
    />
  ))
  .add('controlled toggle ', () => (
    <Toggle
      checked={boolean('checked', false)}
      onChange={action('changed')}
    />
  ));

