import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function Intelligence(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
Intelligence.propTypes = {
  children: PropTypes.element.isRequired,
}
