import React from 'react';
import PropTypes from 'prop-types';
import styles from './reskin-headerStyles.scss';
import waitlistTableStyles from '../reskin-styles.scss';
import { Icon, IconButton } from '../../../../../library';

const WaitListTableHeader = ({ exitFullScreen, segmentedWaitList, isFilterActive, waitlist }) => (
  <div className={styles.waitListTableHeaderWrapper}>
    <div
      className={styles.redirect}
      onClick={exitFullScreen}
      role="button"
      tabIndex={0}
      onKeyUp={(e) => e.keyCode === 13 && exitFullScreen}
    >
      <div className={styles.iconWrapper}>
        <Icon size={1} icon="chevron-left" />
      </div>
      Back
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
    <IconButton icon="times" size={2.5} onClick={exitFullScreen} className={styles.closeButton} />
  </div>
);

WaitListTableHeader.propTypes = {
  exitFullScreen: PropTypes.func.isRequired,
  segmentedWaitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  isFilterActive: PropTypes.objectOf(PropTypes.bool).isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default WaitListTableHeader;
