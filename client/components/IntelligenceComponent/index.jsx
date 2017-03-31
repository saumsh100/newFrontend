import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function StarComponent(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
StarComponent.propTypes = {
  children: PropTypes.element.isRequired,
};
