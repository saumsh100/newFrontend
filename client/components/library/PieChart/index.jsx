
import React, { PropTypes } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';

const COLOR_MAP = {
  red: '#FF715C',
  blue: '#8FBBD6',
  green: '#2EC4A7',
  yellow: '#FFC55B',
};

export default function PieChart(props) {
  const {
    type,
    data,
    displayLegend,
    displayTooltips,
  } = props;

  const PieChartComponent = type === 'doughnut' ? Doughnut : Pie;

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
    <PieChartComponent
      data={newData}
      options={options}
    />
  );
}

PieChart.propTypes = {
  data: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
