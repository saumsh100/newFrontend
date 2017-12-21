import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import Card from './';

storiesOf('Card', module)
  .addDecorator(withKnobs)
  .add('Default Card with Border', () => (
    <Card style={{ height: '100px', backgroundColor: '#FAFAFA' }}>
      Testing Card
    </Card>
  ))
  .add('Without a Border', () => (
    <Card noBorder style={{ height: '100px', backgroundColor: '#FAFAFA' }}>
      Without a border
    </Card>
  ));
