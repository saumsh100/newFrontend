
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';

export default function Social(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>{props.children}</div>
  );
}
Social.propTypes = {
  children: PropTypes.element.isRequired,
};
