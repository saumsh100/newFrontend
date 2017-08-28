
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

  const width = (columnWidth / 100) * 905;
  const styleHeader = {
    width: 'auto',
    maxWidth: `${width}px`,
  };

  return (
    <div className={styles.columnHeader} style={styleHeader} >
      <div className={styles.columnHeader_text}>
        {columnHeaderName}
      </div>
    </div>
  );
}
