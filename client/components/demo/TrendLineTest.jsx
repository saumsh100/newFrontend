
import React from 'react';
import {
  TrendLine,
} from '../library';

function GridTest() {
  return (
    <div>
      <TrendLine values={[5, 10, 40, 10, 15, 50, 20, 10, 10, 10, 20]} />
    </div>
  );
}

export default GridTest;
