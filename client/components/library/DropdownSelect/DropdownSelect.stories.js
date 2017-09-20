
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import DropdownSelect from './';

const options = [
  { value: 'Edmonton' },
  { value: 'Calgary' },
  { value: 'Vancouver' },
];

const style = {
  width: '200px',
};

storiesOf('DropdownSelect', module)
  .addDecorator(withKnobs)
  .add('with options ', () => (
    <DropdownSelect
      onChange={action('changed')}
      label="Test"
      options={options}
      style={object('Style', style)}
    />
  ))
  .add('no options ', () => (
    <DropdownSelect
      label="Test"
      options={[]}
    />
  ));

