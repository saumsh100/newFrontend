
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import Avatar from './';

const displayFlex = {
  display: 'flex'
}

storiesOf('Avatar', module)
  .addDecorator(withKnobs)
  .add('extra large size', () => (
    <div style={displayFlex}>
      <Avatar
        user={{ firstName: 'Justin' }}
        size="xl"
      />
    </div>
  ))
  .add('large size', () => (
    <div style={displayFlex}>
      <Avatar
        user={{ firstName: 'Justin' }}
        size="lg"
      />
    </div>
  ))
  .add('Medium size', () => (
    <div style={displayFlex}>
      <Avatar
        user={{ firstName: 'Justin' }}
        size="md"
      />
    </div>
  ))
  .add('small size', () => (
    <div style={displayFlex}>
      <Avatar
        user={{ firstName: 'Justin' }}
        size="sm"
      />
    </div>
  ))
  .add('extra small size', () => (
    <div style={displayFlex}>
      <Avatar
        user={{ firstName: 'Justin' }}
        size="xs"
      />
    </div>
  ))
  .add('with image URL', () => (
    <Avatar
      user={{ fullAvatarUrl: 'https://placeimg.com/80/80/animals', firstName: 'Justin' }}
    />
  ))
  .add('with gradient background color', () => (
    <div style={displayFlex}>
      <Avatar
        bgColor="primaryColor"
        user={{ firstName: 'Justin' }}
      />
    </div>
  ));

