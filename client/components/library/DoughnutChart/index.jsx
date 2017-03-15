
import React, { PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';

const COLOR_MAP = {
  red: '#FF715C',
  blue: '#8FBBD6',
  green: '#2EC4A7',
  yellow: '#FFC55B',
};

export default function DoughnutChart(props) {
  const {
    data,
    displayLegend,
    displayTooltips,
  } = props;

  const values = data.map(d => d.value);
  const colors = data.map(d => COLOR_MAP[d.color]);
  const labels = data.map((d, i) => d.label || i);

  const legend = {
    display: !!displayLegend,
  };

  const tooltips = {
    enabled: !!displayTooltips,
  };

  const options = {
    // rotation: Math.PI,
    // circumference: Math.PI,
    legend,
    tooltips,
  };

  const newData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  return (
    <Doughnut
      data={newData}
      options={options}
    />
  );
}

DoughnutChart.propTypes = {
  data: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
