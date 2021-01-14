
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { getTodaysDate, getUTCDate } from '../library';

const LastSyncDisplay = ({ date, ttl, className, timezone }) => {
  if (!date) return null;
  const mDate = getUTCDate(date, timezone);
  const isOff = mDate.isBefore(getTodaysDate(timezone).subtract(ttl, 'minutes'));
  const statusClass = isOff ? styles.off : styles.on;
  const classes = classNames(className, statusClass);
  const displayString = `Last synced ${mDate.fromNow(true)} ago`;
  return <div className={classes}>{displayString}</div>;
};

LastSyncDisplay.propTypes = {
  date: PropTypes.string,
  className: PropTypes.string,
  ttl: PropTypes.number,
  timezone: PropTypes.string.isRequired,
};

LastSyncDisplay.defaultProps = {
  ttl: 30,
  date: null,
  className: null,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(LastSyncDisplay);
