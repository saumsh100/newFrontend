
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function WebsiteTrafficSources(props) {
  const { chartData, labels, title } = props;

  const ticks = {
    fontSize: 16,
    fontFamily: 'Gotham-Book',
    fontColor: '#2e3845',
    padding: 20,
    maxRotation: 0,
    autoSkip: false,
    callback(value, index) {
      if (typeof value === 'number' && index % 3 === 0) {
        if (Number.isSafeInteger(value)) {
          return value;
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
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
            ...ticks,
          },
          gridLines: {
            beginAtZero: true,
            drawTicks: false,
          },
        },
      ],

      xAxes: [
        {
          ticks,
          gridLines: {
            offsetGridLines: true,
            display: true,
            drawTicks: false,
            drawOnChartArea: false,
          },
        },
      ],
    },
  };

  return (
    <Card className={styles.websiteTrafikSources}>
      <div className={styles.websiteTrafikSources__header}>
        <CardHeader title={title} />
      </div>
      <div className={styles.websiteTrafikSources__mainContent}>
        <BarChart
          displayTooltips
          labels={labels}
          dataSets={chartData}
          height={500}
          options={lineChartOptions}
        />
      </div>
    </Card>
  );
}

WebsiteTrafficSources.propTypes = {
  chartData: PropTypes.arrayOf(Object),
};
