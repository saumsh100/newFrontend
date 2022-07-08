import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import colorMap from '../../../library/util/colorMap';
import styles from '../../styles';

const generateChartOptions = () => {
  const ticks = {
    fontSize: 12,
    fontStyle: 'bold',
    fontFamily: 'Inter',
    fontColor: '#ecebff',
    maxRotation: 0,
    autoSkip: true,
    beginAtZero: true,
    padding: 8,
    callback(value) {
      if (
        typeof value === 'number' &&
        value % 1000 === 0 &&
        value !== 0 &&
        (value / 1000) % 2 === 0
      ) {
        return `${value / 1000}k`;
      }
      return value;
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
            color: '#412c7d',
            tickMarkLength: 20,
            offsetGridLines: false,
            zeroLineColor: '#412c7d',
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

    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 16,
      },
    },
  };

  const toolTips = {
    enabled: true,
    fontFamily: 'Inter',
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
      fontColor: '#ecebff',
      fontFamily: 'Inter',
    },
  };

  return {
    legend,
    tooltips: toolTips,
    ...lineChartOptions,
  };
};

const generateDataSet = (labels, billedData, estimatedData, canvas) => {
  const ctx = canvas.getContext('2d');
  const gradientFill = ctx.createLinearGradient(0, 0, 0, 317);
  gradientFill.addColorStop(0, 'rgba(103, 76, 255, 0.57)');
  gradientFill.addColorStop(1, 'rgba(103, 76, 255, 0.05)');

  const defaultDataSet = {
    fill: true,
    lineTension: 0,
    backgroundColor: gradientFill,
    borderColor: '#C7C2FF',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: '#C7C2FF',
    pointBackgroundColor: '#241158',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: colorMap.green,
    pointHoverBorderColor: colorMap.dark,
    pointHoverBorderWidth: 2,
    pointRadius: 5,
    pointHitRadius: 10,
    borderWidth: 2,
  };
  return {
    labels,
    datasets: [
      {
        ...defaultDataSet,
        label: 'Booked',
        pointBackgroundColor: '#241158',
        data: billedData,
      },
      {
        ...defaultDataSet,
        label: 'Estimated',
        pointBackgroundColor: '#241158',
        pointHoverBackgroundColor: colorMap.blue,
        data: estimatedData,
      },
    ],
  };
};

export default function RevenueChart(props) {
  const { labels, billedData, estimatedData, isValid } = props;

  return (
    <div className={styles.revenueChart_chart}>
      {isValid ? (
        <Line
          options={generateChartOptions()}
          data={(canvas) => generateDataSet(labels, billedData, estimatedData, canvas)}
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
