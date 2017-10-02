
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Loading(props) {
  const classes = classNames(props.className, styles.loadingWrapper);
  return (
    <div className={classes}>
      <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.icon}`} />
    </div>
  );
}

Loading.propTypes = {
  // disabled: PropTypes.bool,
  className: PropTypes.string,
};
