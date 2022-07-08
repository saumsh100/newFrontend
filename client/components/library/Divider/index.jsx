import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Divider = ({ vertical = false, className }) => {
  return (
    <div
      className={classNames(
        vertical ? styles.verticalDivider : styles.horizontalDivider,
        className,
      )}
    />
  );
};

Divider.defaultProps = {
  vertical: false,
  className: '',
};

Divider.propTypes = {
  vertical: PropTypes.bool,
  className: PropTypes.string,
};

export default Divider;
