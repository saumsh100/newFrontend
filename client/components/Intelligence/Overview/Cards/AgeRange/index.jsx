import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function AgeRange(props) {
  const {
    chartData,
  } = props;

  const ticks = {
    fontSize: 16,
    fontFamily: 'Gotham-Book',
    fontColor: '#2e3845',
    padding: 30,
    maxRotation: 0,
    autoSkip: false,
    callback(value, index) {
      if (typeof value === 'number') {
        if (Number.isSafeInteger(value)) {
          return `${value}%`;
        }
      }
      if (typeof value !== 'number') {
        return value;
      }
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks,
        gridLines: {
          beginAtZero: true,
          drawTicks: false,
        },
      }],

      xAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
          ...ticks,
        },
        gridLines: {
          offsetGridLines: true,
          display: true,
          drawTicks: false,
          drawOnChartArea: false,
          beginAtZero: true,
        },
      }],
    },
    barValueSpacing: 2
  };

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader} title="Age Range for the Last 12 Months" />
      <div className={styles.ageRange}>
        <div className={styles.ageRange__content}>
          <BarChart
            type="horizontal"
            displayTooltips
            height={500}
            labels={['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']}
            dataSets={[{
              label: 'Appointments Percentage',
              color: ['yellow', 'red', 'green', 'blue', 'darkblue'],
              data: chartData,
            }]}
            options={lineChartOptions}
          />
        </div>
      </div>
    </Card>
  );
}

AgeRange.propTypes = {
  chartData: PropTypes.arrayOf(Number)
};
