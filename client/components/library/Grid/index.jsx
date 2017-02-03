
import React, { PropTypes } from 'react';
import { Grid as RFBGrid, Col as RFBCol, Row as RFBRow } from 'react-flexbox-grid';

export function Grid(props) {
  return <RFBGrid {...props}/>;
}

export function Col(props) {
  return <RFBCol {...props}/>;
}

export function Row(props) {
  return <RFBRow {...props}/>;
}
