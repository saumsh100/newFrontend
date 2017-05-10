
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean, withKnobs } from '@kadira/storybook-addon-knobs';
import AutoCompleteForm from './';

storiesOf('AutoComplete', module)
  .addDecorator(withKnobs)
  .add('AutoCompleteForm', () => (
    <AutoCompleteForm />
));
