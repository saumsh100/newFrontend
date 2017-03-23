
import React, { PropTypes } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import colorMap from '../util/colorMap';

export default function PieChart(props) {
  const {
    type,
    data,
    displayLegend,
    displayTooltips,
    width,
    height,
  } = props;

  const PieChartComponent = type === 'doughnut' ? Doughnut : Pie;

  const values = data.map(d => d.value);
  const colors = data.map(d => colorMap[d.color]);
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

  if (width && height) {
    options.maintainAspectRatio = false;
  }

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
      width={width}
      height={height}
    />
  );
}

PieChart.propTypes = {
  data: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
