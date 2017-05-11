
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, boolean, object } from '@kadira/storybook-addon-knobs';
import TextArea from './';


storiesOf('TextArea', module)
  .addDecorator(withKnobs)
  .add('Default TextArea', () => (
    <TextArea
      onChange={action('change')}
    />
  ));
