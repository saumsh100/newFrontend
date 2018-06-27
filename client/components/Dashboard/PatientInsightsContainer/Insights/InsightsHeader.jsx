
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function InsightsHeader({ insightCount }) {
  return (
    <div className={styles.header}>
      <div className={styles.header_count}>
        <span>{insightCount}</span>
      </div>
      <span>
        {' '}
        {insightCount === 1 ? 'Patient Insight' : 'Patient Insights'}{' '}
      </span>
    </div>
  );
}

InsightsHeader.propTypes = {
  insightCount: PropTypes.number,
};
