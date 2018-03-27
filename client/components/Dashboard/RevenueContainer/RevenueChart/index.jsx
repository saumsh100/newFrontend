
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import colorMap from '../../../library/util/colorMap';
import styles from './styles.scss';

const generateChartOptions = () => {
  const ticks = {
    fontSize: 10,
    fontFamily: 'Gotham-Book',
    fontColor: '#ffffff',
    maxRotation: 0,
    autoSkip: true,
    beginAtZero: true,
    padding: 20,
    callback(value, index) {
      if (typeof value === 'number' && value % 1000 === 0 && value !== 0 && ((value / 1000) % 2 === 0)) {
        return `${value / 1000}k`;
      }
      if (typeof value !== 'number' || value === 0) {
        return value;
      }
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks,
        gridLines: {
          display: true,
          drawTicks: false,
          color: '#00000',
          tickMarkLength: 20,
          offsetGridLines: true,
        },
      }],

      xAxes: [{
        ticks,
        gridLines: {
          display: false,
          tickMarkLength: 20,
        },
      }],
      scaleLabel: {
        paddingTop: 30,
      },
    },
  };

  const toolTips = {
    enabled: true,
    fontFamily: 'Gotham-Book',
    fontSize: 10,
    callbacks: {
      title: (tooltipItem, data) => {
        const month = tooltipItem[0].xLabel[0];
        const day = tooltipItem[0].xLabel[1];

        return `${month} ${day}`;
      },
      label: (tooltipItem, data) => {
        return `$${tooltipItem.yLabel}`;
      },
    },
  };

  const legend = {
    display: false,
  };

  return {
    legend,
    tooltips: toolTips,
    ...lineChartOptions,
  };
};

const generateDataSet = (labels, data) => {
  return {
    labels,
    datasets: [
      {
        fill: true,
        lineTension: 0,
        backgroundColor: '#242c36',
        borderColor: colorMap.white,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: colorMap.white,
        pointBackgroundColor: '#242c36',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colorMap.green,
        pointHoverBorderColor: colorMap.dark,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data,
      },
    ],
  };
};

export default function RevenueChart(props) {
  const {
    labels,
    data,
    isValid,
  } = props;

  return (
    <div className={styles.chart}>
      {isValid ?
        <Line
          options={generateChartOptions()}
          data={generateDataSet(labels, data)}
        /> :
        <div className={styles.noRevenue}> No Revenue </div>}
    </div>
  );
}

RevenueChart.propTypes = {
  labels: PropTypes.instanceOf(Array),
  data: PropTypes.instanceOf(Array),
  isValid: PropTypes.bool,
};
