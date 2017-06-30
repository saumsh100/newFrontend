
import React, { Components, PropTypes } from 'react';
import { Icon } from '../../../library'
import styles from '../styles.scss';

export default function ShowColumnHeader(props) {
  const {
    scheduleView,
    columnWidth,
    index,
    columnHeaderName,
  } = props;

  return (
    <div className={styles.columnHeader} >
      <div className={styles.columnHeader_text}>
        {columnHeaderName}
      </div>
    </div>
  );
}
