import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { LineChart } from '../../library';
import styles from './styles.scss';

function CallsGraph(props) {
  const { callGraphStats } = props;

  const graphData = callGraphStats.toJS().data;
  const x = graphData.xValues;
  const y = graphData.yValues;

  const maxCalls = Math.max(...y);
  const newY = y.slice(0, -1);

  const ticks = {
    fontSize: 14,
    fontFamily: 'Inter',
    fontStyle: 'bold',
    fontColor: '#241158',
    padding: 8,
    maxRotation: 0,
    autoSkip: false,
    beginAtZero: true,
    callback(value, index) {
      // Dealing with y-axis values
      if (typeof value === 'number' && Number.isSafeInteger(value)) {
        if (maxCalls > 10 && value % 5 === 0) {
          return value;
        }
        if (value % 2 === 0) {
          return value;
        }
      }

      // Dealing with x-axis values and skipping indices when dealing with large sets
      if (index % 2 === 0 && typeof value !== 'number' && x.length < 45) {
        return '';
      }

      if (index % 2 !== 0 && x.length < 45 && typeof value !== 'number') {
        return value;
      }

      if (x.length > 45 && typeof value !== 'number' && index % 5 === 0) {
        return value;
      }

      return null;
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    borderWidth: 3,
    scales: {
      yAxes: [
        {
          ticks,
          gridLines: {
            beginAtZero: true,
            display: true,
            drawTicks: false,
            color: '#dedbff',
            tickMarkLength: 20,
            offsetGridLines: false,
            zeroLineColor: '#dedbff',
            drawBorder: true,
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
        top: 8,
        bottom: 0,
      },
    },
  };

  const dataSets = [
    {
      label: 'Calls Received',
      color: 'lavender500',
      data: newY,
      fill: false,
      pointColor: 'purple050',
      pointHoverColor: 'lavender200',
    },
  ];

  return (
    <div className={styles.callsGraphContainer}>
      <div className={styles.callGraph}>
        <LineChart
          displayTooltips
          labels={x}
          height={240}
          dataSets={dataSets}
          options={lineChartOptions}
        />
      </div>
    </div>
  );
}

CallsGraph.propTypes = {
  callGraphStats: PropTypes.instanceOf(Record).isRequired,
};

export default CallsGraph;
