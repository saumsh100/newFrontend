
import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { LineChart, DateTimeObj } from '../../library';
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
    fontFamily: 'Gotham-Book',
    fontColor: '#206477',
    padding: 20,
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
    scales: {
      yAxes: [
        {
          ticks,
          gridLines: {
            beginAtZero: true,
            drawTicks: false,
            tickMarkLength: 20,
            offsetGridLines: false,
            display: true,
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

  const dataSets = [
    {
      label: 'Calls Received',
      color: 'dark',
      data: newY,
      fill: false,
      pointColor: 'white',
      pointHoverColor: 'white',
    },
  ];

  return (
    <div className={styles.callsGraphContainer}>
      <div className={styles.subHeader}>
        {props.startDate.format('MMMM DD, YYYY')} - {props.endDate.format('MMMM DD, YYYY')}
      </div>
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
  startDate: PropTypes.instanceOf(DateTimeObj).isRequired,
  endDate: PropTypes.instanceOf(DateTimeObj).isRequired,
  callGraphStats: PropTypes.instanceOf(Record).isRequired,
};

export default CallsGraph;
