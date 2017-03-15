
import React, { PropTypes } from 'react';
import { Card, Guage } from '../library';

export default function GuageTest() {
  return (
    <Card>
      <Guage
        percentage={75}
      />
    </Card>
  );
}

Guage.propTypes = {

};
