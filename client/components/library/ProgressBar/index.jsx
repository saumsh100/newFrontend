
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function ProgressBar(props) {
  const {
    percentage,
    noTextDisplay,
  } = props;

  const roundedPercentage = Math.round(percentage);
  const width = `${roundedPercentage}%`;
  const text = noTextDisplay ? null : width;

  return (
    <div className={styles.wrapper}>
      <div style={{ width }} className={styles.bar}>
        {text}
      </div>
    </div>
  );
}

ProgressBar.defaultProps = {
  percentage: 50,
  noTextDisplay: false,
};

ProgressBar.propTypes = {
  percentage: PropTypes.number,
  noTextDisplay: PropTypes.bool,
};
