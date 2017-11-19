
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import Lorem from 'react-lorem-component';
import SMSPreview from './index';

storiesOf('SMS Preview', module)
  .addDecorator(withKnobs)
  .add('standard', () => (
    <SMSPreview
      from="999-99"
      message={<Lorem format="text" count={1} />}
    />
  ));
