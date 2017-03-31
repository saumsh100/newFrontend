import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function ReputationComponent(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
ReputationComponent.propTypes = {
  children: PropTypes.element.isRequired,
}
