
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';

export default function Intelligence(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>{props.children}</div>
  );
}

Intelligence.propTypes = {
  children: PropTypes.element.isRequired,
};
