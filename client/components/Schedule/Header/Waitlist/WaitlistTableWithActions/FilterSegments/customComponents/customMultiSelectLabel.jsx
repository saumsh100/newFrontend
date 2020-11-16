
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const CustomMultiSelectLabel = ({ children, count }) => (
  <div>
    {children} {!!count && <span className={styles.rowCount}>({count})</span>}
  </div>
);

CustomMultiSelectLabel.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
};

CustomMultiSelectLabel.defaultProps = {
  count: null,
};

export default memo(CustomMultiSelectLabel);
