
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

const generatePathDescription = (width, height, values) => {
  const increment = width / values.length;

  let d = 'M 0 0';

  // TODO: make first x,y the starting point
  // TODO: make dataPoints relative to eachother, to all fit

  values.forEach((value, i) => {
    d += ` L ${value} ${increment * i}`;
  });

  return d;
};

export default function TrendLine(props) {
  const {
    className,
    color,
    values,
    width,
    height,
  } = props;

  const classes = classNames(className, styles.wrapper);
  const pathDescription = generatePathDescription(width, height, values);

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...props} className={classes}>
      <svg x="0" y="0" width="100" height="50">
        <path
          stroke="#8FBBD6"
          strokeWidth="1.5px"
          fill="none"
          d={pathDescription}
        />
      </svg>
    </div>
  );
}

TrendLine.defaultProps = {
  width: 200,
  height: 50,
};

TrendLine.propTypes = {
  // children: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.number),
};
