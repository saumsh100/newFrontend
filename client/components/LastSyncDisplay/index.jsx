
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import styles from './styles.scss';

export default function LastSyncDisplay(props) {
  const { date, ttl, className } = props;
  if (!date) return null;
  const mDate = moment(date);
  const isOff = mDate.isBefore(moment().subtract(ttl, 'minutes'));
  const statusClass = isOff ? styles.off : styles.on;
  const classes = classNames(className, statusClass);
  const displayString = `Last synced ${mDate.fromNow(true)} ago`;
  return <div className={classes}>{displayString}</div>;
}

LastSyncDisplay.defaultProps = {
  ttl: 30,
};

LastSyncDisplay.propTypes = {
  date: PropTypes.string,
  className: PropTypes.string,
};
