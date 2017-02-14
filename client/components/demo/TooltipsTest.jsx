
import React, { PropTypes } from 'react';
import { Link, Tooltip } from '../library';

export default function TooltipsTest() {
  const overlay = (
    <div style={{ fontSize: '1.2em', textAlign: 'center' }}>
      Coming
      <br/>
      Soon
    </div>
  );

  return (
    <div style={{ marginLeft: '100px' }}>
      <Tooltip
        overlay={overlay}
      >
        <Link to="/" disabled>Testing</Link>
      </Tooltip>
    </div>
  );
}
