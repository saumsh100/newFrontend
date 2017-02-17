
import React, { PropTypes } from 'react';
import GridTest from '../demo/GridTest';
import TestInfiniteScroll from '../demo/TestInfiniteScroll';

export default function Account(props) {
  return (
    <div>
      <h1>Account Settings</h1>
      <GridTest />
      <TestInfiniteScroll />
    </div>
  );
}
