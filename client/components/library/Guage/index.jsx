
import React, { PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';

const COLOR_MAP = {
  red: '#FF715C',
  blue: '#8FBBD6',
  green: '#2EC4A7',
  yellow: '#FFC55B',
};

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

  const hexColor = COLOR_MAP[color];
  const greyColor = '#DCDCDC';

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
