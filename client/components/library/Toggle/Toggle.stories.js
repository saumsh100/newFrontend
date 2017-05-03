
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, boolean, } from '@kadira/storybook-addon-knobs';

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

