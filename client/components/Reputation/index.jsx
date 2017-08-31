import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function Reputation(props) {
  const {
    children,
  } = props;

  return (
    <div className={styles.mainIntelligenceContainer}>
      <children {...props} />
    </div>
  );
}
Reputation.propTypes = {
  children: PropTypes.element.isRequired,
}
