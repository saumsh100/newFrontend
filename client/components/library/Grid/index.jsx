
import React from 'react';

import classNames from 'classnames';
import {
  Grid as RFBGrid,
  Col as RFBCol,
  Row as RFBRow,
} from 'react-flexbox-grid';
import styles from './styles.scss';

export function Grid(props) {
  const classes = classNames(styles.grid, props.className);
  return <RFBGrid {...props} className={classes} />;
}

export function Col(props) {
  const classes = classNames(styles.col, props.className);
  return <RFBCol {...props} className={classes} />;
}

export function Row(props) {
  const classes = classNames(styles.row, props.className);
  return <RFBRow {...props} className={classes} />;
}
