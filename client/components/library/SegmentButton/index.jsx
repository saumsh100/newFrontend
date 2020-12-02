
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const SegmentButton = ({ children, buttonState, count, ...rest }) => {
  const buttonStateClassName = buttonState && styles[`segmentButton_${buttonState}`];
  return (
    <div
      className={classNames(styles.segmentButton, buttonStateClassName)}
      role="button"
      tabIndex={0}
      {...rest}
    >
      {children}
      {!!count && <span className={styles.segmentButtonCount}>{count}</span>}
    </div>
  );
};

SegmentButton.propTypes = {
  children: PropTypes.node,
  buttonState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

SegmentButton.defaultProps = {
  children: '',
  buttonState: undefined,
  count: undefined,
};

export default SegmentButton;
