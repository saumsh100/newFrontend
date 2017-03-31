import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function IntelligenceComponent(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
IntelligenceComponent.propTypes = {
  children: PropTypes.element.isRequired,
}
