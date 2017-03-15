
import React, { PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';
import colorMap from '../util/colorMap';

export default function Guage(props) {
  const {
    percentage,
    color = 'red',
  } = props;

  const legend = {
    display: false,
  };

  const tooltips = {
    enabled: false,
  };

  const options = {
    rotation: Math.PI,
    circumference: Math.PI,
    legend,
    tooltips,
  };

  const hexColor = colorMap[color];
  const greyColor = colorMap.lightgrey;

  const data = {
    labels: [
      'Left',
      'Right',
    ],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          hexColor,
          greyColor,
        ],
        hoverBackgroundColor: [
          hexColor,
          greyColor,
        ],
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={options}
    />
  );
}

Guage.propTypes = {
  percentage: PropTypes.number,
  color: PropTypes.oneOf([
    'red',
    'green',
    'blue',
    'yellow',
  ]),
};
