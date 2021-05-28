import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Loading = ({ className, smallSize, disableFlex, as: As }) => (
  <As
    className={classNames(
      className,
      disableFlex ? styles.loadingWrapperNoFlex : styles.loadingWrapper,
    )}
  >
    <i
      className={classNames(
        `fa fa-spinner fa-spin fa-fw ${styles.icon}`,
        { 'fa-1x': smallSize },
        { 'fa-3x': !smallSize },
      )}
    />
  </As>
);

Loading.propTypes = {
  className: PropTypes.string,
  smallSize: PropTypes.bool,
  disableFlex: PropTypes.string,
  as: PropTypes.string,
};
Loading.defaultProps = { className: '', smallSize: false, disableFlex: false, as: 'div' };

export default Loading;
