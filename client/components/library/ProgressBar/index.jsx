
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function ProgressBar(props) {
  const { percentage, noTextDisplay } = props;

  const roundedPercentage = Math.round(percentage);
  // Make sure its not less than 0 or greater than 100
  const flooredPercentage = Math.max(0, roundedPercentage);
  const cieledPercentage = Math.min(100, flooredPercentage);
  const width = `${cieledPercentage}%`;
  const text = noTextDisplay ? null : width;

  return (
    <div className={styles.wrapper}>
      {percentage ? (
        <div style={{ width }} className={styles.bar}>
          {text}
        </div>
      ) : null}
    </div>
  );
}

ProgressBar.defaultProps = {
  percentage: 0,
  noTextDisplay: false,
};

ProgressBar.propTypes = {
  percentage: PropTypes.number,
  noTextDisplay: PropTypes.bool,
};
