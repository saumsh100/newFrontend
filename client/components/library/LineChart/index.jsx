import PropTypes from 'prop-types';
import React from 'react';
import { Line } from 'react-chartjs-2';
import colorMap from '../util/colorMap';

const axesOptions = {};

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
      const {
        data,
        label,
        color,
        pointColor,
        pointBorderColor,
        pointHoverColor,
        pointHoverBorderColor,
      } = ds;
      return {
        ...ds,
        data,
        label,
        // DEFAULT STYLES, we will adapt this as we go
        lineTension: 0,
        fill: false,
        steppedLine: 'before',
        backgroundColor: colorMap[color],
        borderColor: colorMap[color],
        borderCapStyle: 'butt',
        borderDash: [],
        borderWidth: 2,
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        pointBorderColor: colorMap[pointBorderColor || color],
        pointBackgroundColor: colorMap[pointColor || color],
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colorMap[pointHoverColor || color],
        pointHoverBorderColor: colorMap[pointHoverBorderColor || color],
        pointHoverBorderWidth: 1,
        pointRadius: 5,
        pointHitRadius: 10,
        hitRadius: 0,
      };
    }),
  };

  return <Line {...props} data={newData} options={finalOptions} height={height} width={width} />;
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataSets: PropTypes.arrayOf(PropTypes.any).isRequired,
  displayLegend: PropTypes.bool.isRequired,
  displayTooltips: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  options: PropTypes.shape({}).isRequired,
};
