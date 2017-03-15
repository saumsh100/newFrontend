
import React, { PropTypes } from 'react';
import { Bar } from 'react-chartjs-2';

const COLOR_MAP = {
  red: '#FF715C',
  blue: '#8FBBD6',
  green: '#2EC4A7',
  yellow: '#FFC55B',
};

export default function BarChart(props) {
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

      // Color can be set for all or can be specific per datapoint
      let backgroundColor;
      let borderColor;
      if (typeof color === 'string') {
        backgroundColor = COLOR_MAP[color];
        borderColor = COLOR_MAP[color];
      } else {
        backgroundColor = color.map(c => COLOR_MAP[c]);
        borderColor = color.map(c => COLOR_MAP[c]);
      }

      return Object.assign({ data, label }, {
        // DEFAULT STYLES, we will adapt this as we go
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        borderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        backgroundColor,
        borderColor,
      });
    }),
  };

  return (
    <Bar
      data={newData}
      options={options}
    />
  );
}

BarChart.propTypes = {
  labels: PropTypes.array,
  dataSets: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
