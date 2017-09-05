import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function Reputation(props) {
  console.log(props.children)
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
Reputation.propTypes = {
  children: PropTypes.element.isRequired,
}
