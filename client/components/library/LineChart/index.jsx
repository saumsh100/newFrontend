
import React, { PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
import colorMap from '../util/colorMap';

const axesOptions = {

};

export default function LineChart(props) {
  const {
    dataSets = [],
    labels = [],
    displayLegend,
    displayTooltips,
    height,
    width,
    options = {},
  } = props;

  const legend = {
    display: !!displayLegend,
  };

  const tooltips = {
    enabled: !!displayTooltips,
  };

  const finalOptions = {
    legend,
    tooltips,
    ...axesOptions,
    ...options,
  };

  const newData = {
    labels,
    datasets: dataSets.map((ds) => {
      const { data, label, color } = ds;
      return Object.assign({ data, label }, {
        // DEFAULT STYLES, we will adapt this as we go
        lineTension: 0,
        fill: false,
        backgroundColor: colorMap[color],
        borderColor: colorMap[color],
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        pointBorderColor: colorMap[color],
        pointBackgroundColor: colorMap[color],
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colorMap[color],
        pointHoverBorderColor: colorMap[color],
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
      });
    }),
  };

  return (
    <Line
      {...props}
      data={newData}
      options={finalOptions}
      height={height}
      width={width}
    />
  );
}

LineChart.propTypes = {
  labels: PropTypes.array,
  dataSets: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
