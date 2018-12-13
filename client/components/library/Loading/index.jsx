
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Loading = ({ className }) => (
  <div className={classNames(className, styles.loadingWrapper)}>
    <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.icon}`} />
  </div>
);

Loading.propTypes = { className: PropTypes.string };
Loading.defaultProps = { className: '' };

export default Loading;
