
import React, { PropTypes } from 'react';
import styles from './styles.scss';

function Connect(props) {
  const { children } = props;

  return (
    <div className={styles.connectContainer}>
      <div className={styles.connectCenter}>{children}</div>
    </div>
  );
}

Connect.propTypes = {};

export default Connect;
