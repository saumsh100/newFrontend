
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean } from '@kadira/storybook-addon-knobs';

import DropdownSelect from './';

const options = [
  { value: 'Edmonton' },
  { value: 'Calgary' },
  { value: 'Vancouver' },
];

storiesOf('DropdownSelect', module)
  .add('with options ', () => (
    <DropdownSelect
      onChange={action('changed')}
      label="Test"
      options={options}
    />
  ))
  .add('no options ', () => (
    <DropdownSelect
      label="Test"
      options={[]}
    />
  ));

