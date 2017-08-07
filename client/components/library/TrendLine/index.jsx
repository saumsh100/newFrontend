
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import max from 'lodash/max';
import min from 'lodash/min';
import styles from './styles.scss';

const generateSVGPoints = (width, height, values) => {
  const len = values.length;
  const increment = width / (len - 1);
  const yMax = max(values);
  const yMin = min(values);
  const valuesHeight = yMax - yMin;
  const points = [];

  let i;
  for (i = 0; i < len; i++) {
    const yValue = values[i];
    const yRatio = (yValue - yMin) / valuesHeight;
    const y = height - (yRatio * height);
    const x = increment * i;
    points.push({ x, y });
  }

  return points;
};

const convertPointsToPathDescription = (points) => {
  const len = points.length;
  let d = `M ${points[0].x} ${points[0].y}`;

  let i;
  for (i = 1; i < len; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }

  return d;
};

export default function TrendLine(props) {
  const {
    className,
    color,
    strokeWidth,
    values,
    width,
    height,
  } = props;
  if (values.length < 1) {
    return null;
  }
  const classes = classNames(className, styles.wrapper);
  const svgPoints = generateSVGPoints(width, height, values);
  const pathDescription = convertPointsToPathDescription(svgPoints);

  const svgProps = {
    x: 0,
    y: 0,
    width,
    height,
  };

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...props} className={classes}>
      <svg {...svgProps}>
        <path
          stroke={color}
          strokeWidth={strokeWidth}
          d={pathDescription}
          fill="none"
        />
      </svg>
    </div>
  );
}

TrendLine.defaultProps = {
  color: '#8FBBD6',
  strokeWidth: '1.5px',
  width: 100,
  height: 25,
};

TrendLine.propTypes = {
  // children: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  strokeWidth: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
};
