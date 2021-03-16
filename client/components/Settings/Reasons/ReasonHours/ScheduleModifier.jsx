
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const ScheduleModifier = ({ type, height, label, top, value }) => (
  <div
    className={classNames(styles.slot, styles[type])}
    style={{
      top,
      height,
    }}
  >
    <span className={styles.label}>{label}</span> <p className={styles.value}>{value}</p>
  </div>
);

export default ScheduleModifier;

ScheduleModifier.propTypes = {
  height: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
