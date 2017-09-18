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
    fontFamily: 'Gotham-Medium',
    fontColor: '#2e3845',
    padding: 15,
    maxRotation: 0,
    autoSkip: false,
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
        ticks,
        gridLines: {
          offsetGridLines: true,
          display: true,
          drawTicks: false,
          drawOnChartArea: false,
        },
      }],
    },
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
