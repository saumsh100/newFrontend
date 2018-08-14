
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, CardHeader, PieChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function BusiestTimeOfWeek(props) {
  const { time, day, chartData } = props;

  return (
    <Card>
      <CardHeader
        className={styles.cardHeader}
        title="Busiest time of week"
      />
      <div className={styles.bussiestTimeOfWeekWrapper}>
        <div
          className={classNames(styles.pieChartWrapper)}
          style={{ width: '200px' }}
        >
          <PieChart width={171} height={85} data={chartData} />
        </div>
        <div className={styles.bussiestTimeOfWeekWrapper__day}>
          <div className={styles.bussiestTimeOfWeekWrapper__day__dayContent}>
            <span>{day}</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

BusiestTimeOfWeek.propTypes = {
  time: PropTypes.string,
  day: PropTypes.string,
  chartData: PropTypes.arrayOf(Object),
};
