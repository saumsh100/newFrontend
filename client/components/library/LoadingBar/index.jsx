
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const LoadingBar = ({ className }) => (
  <div className={classNames(className, styles.loadingBarWrapper)}>
    <div className={styles.bar} />
    <div className={styles.bar} />
    <div className={styles.bar} />
  </div>
);

LoadingBar.propTypes = { className: PropTypes.string };
LoadingBar.defaultProps = { className: '' };

export default LoadingBar;
