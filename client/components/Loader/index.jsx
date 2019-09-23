
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from '../../styles/default.scss';

const Loader = ({ isLoaded, inContainer, children }) => {
  if (isLoaded) return children;

  return (
    <div className={classNames(styles.loadBar, { [styles.barInContainer]: inContainer })}>
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  );
};

Loader.propTypes = {
  isLoaded: PropTypes.bool,
  inContainer: PropTypes.bool,
  children: PropTypes.node,
};

Loader.defaultProps = {
  isLoaded: false,
  inContainer: false,
  children: null,
};

export default Loader;
