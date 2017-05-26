
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

import Avatar from './';

storiesOf('Avatar', module)
  .addDecorator(withKnobs)
  .add('with image URL', () => (
    <Avatar
      user={{ url: 'https://placeimg.com/80/80/animals', firstName: 'Justin' }}
    />
  ))
  .add('with text as backup', () => (
    <Avatar
      user={{ firstName: 'Justin' }}
    />
  ));

