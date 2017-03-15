
import React, { PropTypes } from 'react';
import { Line } from 'react-chartjs-2';

const COLOR_MAP = {
  red: '#FF715C',
  blue: '#8FBBD6',
  green: '#2EC4A7',
  yellow: '#FFC55B',
};

export default function LineChart(props) {
  const {
    dataSets = [],
    labels = [],
    displayLegend,
    displayTooltips,
  } = props;

  const legend = {
    display: !!displayLegend,
  };

  const tooltips = {
    enabled: !!displayTooltips,
  };

  const options = {
    legend,
    tooltips,
  };

  const newData = {
    labels,
    datasets: dataSets.map((ds) => {
      const { data, label, color } = ds;
      return Object.assign({ data, label }, {
        // DEFAULT STYLES, we will adapt this as we go
        lineTension: 0,
        fill: false,
        backgroundColor: COLOR_MAP[color],
        borderColor: COLOR_MAP[color],
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        pointBorderColor: COLOR_MAP[color],
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLOR_MAP[color],
        pointHoverBorderColor: COLOR_MAP[color],
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      });
    }),
  };

  return (
    <Line
      data={newData}
      options={options}
    />
  );
}

LineChart.propTypes = {
  labels: PropTypes.array,
  dataSets: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
