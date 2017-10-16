
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import TextArea from './';


storiesOf('TextArea', module)
  .addDecorator(withKnobs)
  .add('Default TextArea', () => (
    <TextArea
      onChange={action('change')}
    />
  ));
