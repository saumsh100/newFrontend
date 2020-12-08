
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { dateFormatter } from '@carecru/isomorphic';
import { Icon } from '../../../library';
import styles from './styles.scss';

const convertToLocaleString = number => (number ? number.toLocaleString('en') : '0');

export default function RevenueDisplay(props) {
  const { billedData, average, timezone, dates, estimatedData } = props;

  const lastDate = dates[dates.length - 1];
  const currentDate = moment()
    .tz(timezone)
    .endOf('day')
    .toISOString();

  const isCurrentDay = lastDate === currentDate;

  const todaysData = !estimatedData.length || isCurrentDay ? billedData[billedData.length - 1] : 0;
  let yestData = billedData[billedData.length - 2];
  let todayText = "Today's";
  let showYestText = true;

  const avg = Math.floor(average);

  if (!isCurrentDay && avg) {
    const isSameWeek = moment()
      .tz(timezone)
      .isSame(lastDate, 'week');
    todayText = isSameWeek
      ? `${dateFormatter(lastDate, timezone, 'ddd')}.`
      : `${dateFormatter(lastDate, timezone, 'MMM Do')}`;
  }

  let percentage = todaysData && avg ? Math.floor((todaysData / avg) * 100 - 100) : 0;

  if (estimatedData.length && avg) {
    percentage = Math.floor((estimatedData[estimatedData.length - 1] / avg) * 100 - 100);
    showYestText = false;
    yestData = isCurrentDay ? estimatedData[0] : estimatedData[estimatedData.length - 1];
  }

  const percentageBoxStyle = classnames(styles.percentageBox, {
    [styles.negative]: percentage < 0,
    [styles.zero]: percentage === 0,
  });

  const icon = percentage < 0 ? 'caret-down' : 'caret-up';

  return (
    <div className={styles.revenueDisplay}>
      <div className={styles.revenueDisplayTop}>
        <div className={styles.todaysProductionText}>{todayText} Billed Production</div>
        <div className={styles.todaysProductionValue}>
          <span className={styles.todaysProductionValue_dollar}>$</span>
          {convertToLocaleString(todaysData)}
        </div>
        <div className={styles.yesterdayContainer}>
          <div className={styles.yesterdayLeft}>
            <span className={styles.yesterdayLeft_text}>Average</span>
            <span className={styles.yesterdayLeft_data}>
              ${convertToLocaleString(Math.floor(average))}
            </span>
          </div>
          <div className={styles.yesterdayRight}>
            <div className={percentageBoxStyle}>
              {percentage !== 0 && (
                <Icon icon={icon} className={styles.percentageBox_icon} type="solid" />
              )}
              {Math.abs(percentage)}%
            </div>
          </div>
        </div>
      </div>
      <div className={styles.average}>
        <div className={styles.average_value}>
          <span className={styles.average_dollar}>$</span>
          {convertToLocaleString(yestData)}
        </div>
        <div className={styles.average_text}>
          {showYestText ? "Yesterday's" : `${todayText} Estimated`} Production
        </div>
      </div>
    </div>
  );
}

RevenueDisplay.propTypes = {
  billedData: PropTypes.arrayOf(PropTypes.number).isRequired,
  estimatedData: PropTypes.arrayOf(PropTypes.number).isRequired,
  average: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
};
