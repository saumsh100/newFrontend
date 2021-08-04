import React from 'react';
import PropTypes from 'prop-types';
import styles from './headerStyles.scss';
import waitlistTableStyles from '../styles.scss';
import { IconButton } from '../../../../../library';

const WaitListTableHeader = ({ exitFullScreen, segmentedWaitList, isFilterActive, waitlist }) => (
  <div className={styles.waitListTableHeaderWrapper}>
    <div className={styles.waitListTableHeaderTitle}>
      {segmentedWaitList?.length && isFilterActive ? (
        <>
          <span className={waitlistTableStyles.waitListCountWrapper}>
            {segmentedWaitList?.length}
          </span>{' '}
          of {waitlist?.length} in Waitlist
        </>
      ) : (
        <>
          <span className={waitlistTableStyles.waitListCountWrapper}>
            {segmentedWaitList?.length}
          </span>{' '}
          in Waitlist
        </>
      )}
    </div>
    <IconButton icon="times" size={1.5} onClick={exitFullScreen} className={styles.closeButton} />
  </div>
);

WaitListTableHeader.propTypes = {
  exitFullScreen: PropTypes.func.isRequired,
  segmentedWaitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  isFilterActive: PropTypes.objectOf(PropTypes.bool).isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default WaitListTableHeader;
