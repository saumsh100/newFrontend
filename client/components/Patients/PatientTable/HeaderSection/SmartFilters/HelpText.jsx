import React from 'react';
import PropTypes from 'prop-types';
import HelpTextLookupTable from './HelpTextLookupTable';
import styles from '../../styles.scss';

export default function HelpText(props) {
  const { activeSegmentLabel } = props;
  const { status, description, communication, followUp, recalls } =
    HelpTextLookupTable[activeSegmentLabel];
  return (
    <div className={styles.helptext_container}>
      {status && (
        <div className={styles.container}>
          <div className={styles.helptext_subHeader}>Patient Status</div>
          <div className={styles.data}>{status}</div>
        </div>
      )}

      {description && (
        <div className={styles.container}>
          <div className={styles.helptext_subHeader}>Description</div>
          <div className={styles.data}>{description}</div>
        </div>
      )}

      {recalls && (
        <div className={styles.container}>
          <div className={styles.helptext_subHeader}>Recalls</div>
          <div className={styles.data}>{recalls}</div>
        </div>
      )}

      {communication && (
        <div className={styles.container}>
          <div className={styles.helptext_subHeader}>Communication</div>
          <div className={styles.data}>{communication}</div>
        </div>
      )}

      {followUp && (
        <div className={styles.container}>
          <div className={styles.helptext_subHeader}>Follow Up</div>
          <div className={styles.data}>{followUp}</div>
        </div>
      )}
    </div>
  );
}

HelpText.propTypes = {
  activeSegmentLabel: PropTypes.string.isRequired,
};
