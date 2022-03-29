import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles';

export default function InsightsHeader({ insightCount }) {
  return (
    <div className={styles.insights_header}>
      <div className={styles.insights_header_count}>
        <span>{insightCount}</span>
      </div>
      <span> {insightCount === 1 ? 'Patient Insight' : 'Patient Insights'} </span>
    </div>
  );
}

InsightsHeader.propTypes = {
  insightCount: PropTypes.number,
};

InsightsHeader.defaultProps = {
  insightCount: 0,
};
