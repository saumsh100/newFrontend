
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import Avatar from './';

storiesOf('Avatar', module)
  .addDecorator(withKnobs)
  .add('with image URL', () => (
    <Avatar
      user={{ avatarUrl: 'https://placeimg.com/80/80/animals', firstName: 'Justin' }}
    />
  ))
  .add('with text as backup', () => (
    <Avatar
      user={{ firstName: 'Justin' }}
    />
  ));

