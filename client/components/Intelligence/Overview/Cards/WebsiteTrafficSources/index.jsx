import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function WebsiteTrafficSources(props) {
  const {
    chartData,
    labels,
    title,
  } = props;

  const ticks = {
    fontSize: 10,
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
