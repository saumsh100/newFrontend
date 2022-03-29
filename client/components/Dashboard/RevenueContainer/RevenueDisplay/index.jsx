import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon, getFormattedDate, getTodaysDate } from '../../../library';
import styles from '../../styles';

const convertToLocaleString = (number) => (number ? number.toLocaleString('en') : '0');

export default function RevenueDisplay(props) {
  const { billedData, average, timezone, dates, estimatedData } = props;

  const lastDate = dates[dates.length - 1];
  const currentDate = getTodaysDate(timezone).endOf('day').toISOString();

  const isCurrentDay = lastDate === currentDate;

  const todaysData = !estimatedData.length || isCurrentDay ? billedData[billedData.length - 1] : 0;
  let yestData = billedData[billedData.length - 2];
  let todayText = "Today's";
  let showYestText = true;

  const avg = Math.floor(average);

  if (!isCurrentDay && avg) {
    const isSameWeek = getTodaysDate(timezone).isSame(lastDate, 'week');
    todayText = isSameWeek
      ? `${getFormattedDate(lastDate, 'ddd', timezone)}.`
      : `${getFormattedDate(lastDate, 'MMM Do', timezone)}`;
  }

  // eslint-disable-next-line no-mixed-operators
  let percentage = todaysData && avg ? Math.floor((todaysData / avg) * 100 - 100) : 0;

  if (estimatedData.length && avg) {
    // eslint-disable-next-line no-mixed-operators
    percentage = Math.floor((estimatedData[estimatedData.length - 1] / avg) * 100 - 100);
    showYestText = false;
    yestData = isCurrentDay ? estimatedData[0] : estimatedData[estimatedData.length - 1];
  }

  const percentageBoxStyle = classnames(styles.revenueDisplay_percentageBox, {
    [styles.revenueDisplay_negative]: percentage < 0,
    [styles.revenueDisplay_zero]: percentage === 0,
  });

  const icon = percentage < 0 ? 'caret-down' : 'caret-up';

  return (
    <div className={styles.revenueDisplay_revenueDisplay}>
      <div className={styles.revenueDisplay_revenueDisplayTop}>
        <div className={styles.revenueDisplay_todaysProductionText}>
          {todayText} Billed Production
        </div>
        <div className={styles.revenueDisplay_todaysProductionValue}>
          <span className={styles.revenueDisplay_todaysProductionValue_dollar}>$</span>
          {convertToLocaleString(todaysData)}
        </div>
        <div className={styles.revenueDisplay_yesterdayContainer}>
          <div className={styles.revenueDisplay_yesterdayLeft}>
            <span className={styles.revenueDisplay_yesterdayLeft_text}>Average</span>
            <span className={styles.revenueDisplay_yesterdayLeft_data}>
              ${convertToLocaleString(Math.floor(average))}
            </span>
          </div>
          <div className={styles.revenueDisplay_yesterdayRight}>
            <div className={percentageBoxStyle}>
              {percentage !== 0 && (
                <Icon
                  icon={icon}
                  className={styles.revenueDisplay_percentageBox_icon}
                  type="solid"
                />
              )}
              {Math.abs(percentage)}%
            </div>
          </div>
        </div>
      </div>
      <div className={styles.revenueDisplay_average}>
        <div className={styles.revenueDisplay_average_value}>
          <span className={styles.revenueDisplay_average_dollar}>$</span>
          {convertToLocaleString(yestData)}
        </div>
        <div className={styles.revenueDisplay_average_text}>
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
