import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';


//import { Button, Welcome } from '@storybook/react/demo';
import { Button, Avatar } from '../client/components/library/';


storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);


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

