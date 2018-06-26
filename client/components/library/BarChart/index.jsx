
import React, { PropTypes } from 'react';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import colorMap from '../util/colorMap';

export default function BarChart(props) {
  const {
    type,
    dataSets = [],
    labels = [],
    displayLegend,
    displayTooltips,
  } = props;

  const BarChartComponent = type === 'horizontal' ? HorizontalBar : Bar;

  const legend = {
    display: !!displayLegend,
  };

  const tooltips = {
    enabled: !!displayTooltips,
  };

  const options = {
    legend,
    tooltips,
    ...props.options,
  };

  const newData = {
    labels,
    datasets: dataSets.map((ds) => {
      const { data, label, color } = ds;

      // Color can be set for all or can be specific per datapoint
      let backgroundColor;
      let borderColor;
      if (typeof color === 'string') {
        backgroundColor = colorMap[color];
        borderColor = colorMap[color];
      } else {
        backgroundColor = color.map(c => colorMap[c]);
        borderColor = color.map(c => colorMap[c]);
      }

      return Object.assign(
        { data, label },
        {
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
        },
      );
    }),
  };

  return <BarChartComponent data={newData} options={options} />;
}

BarChart.propTypes = {
  labels: PropTypes.array,
  dataSets: PropTypes.array,
  displayLegend: PropTypes.bool,
  displayTooltips: PropTypes.bool,
};
