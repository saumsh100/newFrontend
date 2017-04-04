import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function Social(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>
      {props.children}
    </div>
  );
}
  Social.propTypes = {
  children: PropTypes.element.isRequired,
};
