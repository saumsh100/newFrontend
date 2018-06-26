
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '../../../library';
import styles from './styles.scss';

export default function RevenueDisplay(props) {
  const { data, average } = props;

  const todaysData = data[data.length - 1];
  const yestData = data[data.length - 2];
  const avg = Math.floor(average);

  const percentage =
    todaysData && avg ? Math.floor((todaysData / avg) * 100 - 100) : 0;

  let percentageBoxStyle = styles.percentageBox;
  if (percentage < 0) {
    percentageBoxStyle = classnames(percentageBoxStyle, styles.negative);
  } else if (percentage === 0) {
    percentageBoxStyle = classnames(percentageBoxStyle, styles.zero);
  }

  return (
    <div className={styles.revenueDisplay}>
      <div className={styles.revenueDisplayTop}>
        <div className={styles.todaysProductionText}>
          Today's est. Production
        </div>
        <div className={styles.todaysProductionValue}>
          <span className={styles.todaysProductionValue_dollar}>$</span>
          {todaysData || '0'}
        </div>
        <div className={styles.yesterdayContainer}>
          <div className={styles.yesterdayLeft}>
            <span className={styles.yesterdayLeft_text}>Average</span>
            <span className={styles.yesterdayLeft_data}>
              ${Math.floor(average)}
            </span>
          </div>
          <div className={styles.yesterdayRight}>
            <div className={percentageBoxStyle}>
              <Icon
                icon={
                  percentage > 0
                    ? 'caret-up'
                    : percentage !== 0
                      ? 'caret-down'
                      : ''
                }
                className={styles.percentageBox_icon}
                type="solid"
              />
              {percentage < 0 ? percentage * -1 : percentage}%
            </div>
          </div>
        </div>
      </div>
      <div className={styles.average}>
        <div className={styles.average_value}>
          <span className={styles.average_dollar}>$</span>
          {yestData || '0'}
        </div>
        <div className={styles.average_text}> Yesterday's Production</div>
      </div>
    </div>
  );
}

RevenueDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  average: PropTypes.number,
};
