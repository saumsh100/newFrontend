
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';

export default function Reputation(props) {
  return (
    <div className={styles.mainIntelligenceContainer}>{props.children}</div>
  );
}
Reputation.propTypes = {
  children: PropTypes.element.isRequired,
};
