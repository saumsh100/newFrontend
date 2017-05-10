
import React, { PropTypes } from 'react';
import moment from 'moment';
import withTimer from './withTimer';
import styles from './styles.scss';

function Timer(props) {
  const {
    secondsLeft,
    totalSeconds,
    strokeWidth,
    color,
    className,
  } = props;

  console.log(secondsLeft, totalSeconds);

  const radius = 50 - (strokeWidth / 2);
  const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const circumference = Math.PI * 2 * radius;
  const ratio = (totalSeconds - secondsLeft) / totalSeconds;
  const progressStyle = {
    strokeDasharray: `${circumference}px ${circumference}px`,
    strokeDashoffset: `${ratio * circumference}px`,
  };

  const minutesLeft = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft - (minutesLeft * 60);
  const time = moment()
    .minutes(minutesLeft)
    .seconds(seconds).format('m:ss');

  return (
    <svg
      className={`${styles.CircularProgressbar} ${className}`}
      viewBox="0 0 100 100"
    >
      <path
        className={styles.CircularProgressbar_trail}
        d={pathDescription}
        strokeWidth={strokeWidth}
        fill="white"
      />
      <path
        className={styles.CircularProgressbar_path}
        d={pathDescription}
        strokeWidth={strokeWidth}
        fill="none"
        stroke={color}
        style={progressStyle}
      />
      <text
        className={styles.CircularProgressbar_text}
        x={50}
        y={50}
        fill={color}
      >
        {time}
      </text>
    </svg>
  );
}

Timer.defaultProps = {
  strokeWidth: 8,
  color: '#FF715A',
};

Timer.propTypes = {
  strokeWidth: PropTypes.number,
  classForPercentage: PropTypes.func,
  textForSeconds: PropTypes.func,
  color: PropTypes.string.isRequired,
  totalSeconds: PropTypes.number.isRequired,
  secondsLeft: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default withTimer(Timer);
