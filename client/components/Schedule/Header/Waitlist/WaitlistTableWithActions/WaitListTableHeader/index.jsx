import React from 'react';
import PropTypes from 'prop-types';
import styles from './reskin-headerStyles.scss';
import waitlistTableStyles from '../reskin-styles.scss';
import { StandardButton as Button, IconButton } from '../../../../../library';

const WaitListTableHeader = ({ exitFullScreen, segmentedWaitList, isFilterActive, waitlist }) => (
  <div className={styles.waitListTableHeaderWrapper}>
    <div className={styles.closingWrapper}>
      <Button icon="arrow-left" variant="link" title="Back" onClick={exitFullScreen} />
      <IconButton icon="times" size={2.5} onClick={exitFullScreen} className={styles.closeButton} />
    </div>
    <div className={styles.waitListTableHeaderTitle}>
      {segmentedWaitList?.length && isFilterActive ? (
        <>
          <span className={waitlistTableStyles.waitListCountWrapper}>
            {segmentedWaitList?.length}
          </span>
          <span className={waitlistTableStyles.waitListHeaderLength}>
            of {waitlist?.length} In Waitlist
          </span>
        </>
      ) : (
        <>
          <span className={waitlistTableStyles.waitListCountWrapper}>
            {segmentedWaitList?.length}
          </span>
          <span className={waitlistTableStyles.waitListHeaderLength}>In Waitlist</span>
        </>
      )}
    </div>
  </div>
);

WaitListTableHeader.propTypes = {
  exitFullScreen: PropTypes.func.isRequired,
  segmentedWaitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  isFilterActive: PropTypes.objectOf(PropTypes.bool).isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default WaitListTableHeader;
