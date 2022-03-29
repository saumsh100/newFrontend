import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import colorMap from '../../../library/util/colorMap';
import styles from '../../styles';

const generateChartOptions = () => {
  const ticks = {
    fontSize: 10,
    fontFamily: 'Gotham-Book',
    fontColor: '#ffffff',
    maxRotation: 0,
    autoSkip: true,
    beginAtZero: true,
    padding: 20,
    callback(value) {
      if (
        typeof value === 'number' &&
        value % 1000 === 0 &&
        value !== 0 &&
        (value / 1000) % 2 === 0
      ) {
        return `${value / 1000}k`;
      }
      if (typeof value !== 'number' || value === 0) {
        return value;
      }
      return '';
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks,
          gridLines: {
            display: true,
            drawTicks: false,
            color: '#2e3845',
            tickMarkLength: 20,
            offsetGridLines: true,
          },
        },
      ],

      xAxes: [
        {
          ticks,
          gridLines: {
            display: false,
            tickMarkLength: 20,
          },
        },
      ],
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
      title: (tooltipItem) => {
        const month = tooltipItem[0].xLabel[0];
        const day = tooltipItem[0].xLabel[1];
        return `${month} ${day}`;
      },
      label: (tooltipItem) => {
        const number = tooltipItem.yLabel;
        return `$${number.toLocaleString('en')}`;
      },
    },
  };

  const legend = {
    display: false,
    labels: {
      fontColor: colorMap.white,
      fontFamily: 'Gotham-Book',
    },
  };

  return {
    legend,
    tooltips: toolTips,
    ...lineChartOptions,
  };
};

const defaultDataSet = {
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
};

const generateDataSet = (labels, billedData, estimatedData) => ({
  labels,
  datasets: [
    {
      ...defaultDataSet,
      label: 'Booked',
      backgroundColor: '#242c36',
      pointBackgroundColor: '#242c36',
      data: billedData,
    },
    {
      ...defaultDataSet,
      label: 'Estimated',
      backgroundColor: '#4f5966',
      pointBackgroundColor: '#4f5966',
      pointHoverBackgroundColor: colorMap.blue,
      data: estimatedData,
    },
  ],
});

export default function RevenueChart(props) {
  const { labels, billedData, estimatedData, isValid } = props;

  return (
    <div className={styles.revenueChart_chart}>
      {isValid ? (
        <Line
          options={generateChartOptions()}
          data={generateDataSet(labels, billedData, estimatedData)}
        />
      ) : (
        <div className={styles.revenueChart_noRevenue}> No Revenue </div>
      )}
    </div>
  );
}

RevenueChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  billedData: PropTypes.arrayOf(PropTypes.number).isRequired,
  estimatedData: PropTypes.arrayOf(PropTypes.number).isRequired,
  isValid: PropTypes.number,
};

RevenueChart.defaultProps = {
  isValid: 0,
};
