
import React from 'react';
import PropTypes from 'prop-types';
import styles from './headerStyles.scss';
import { IconButton } from '../../../../../library';

const WaitListTableHeader = ({ exitFullScreen }) => (
  <div className={styles.waitListTableHeaderWrapper}>
    <div className={styles.waitListTableHeaderTitle}>Waitlist</div>
    <IconButton icon="times" size={1.5} onClick={exitFullScreen} className={styles.closeButton} />
  </div>
);

WaitListTableHeader.propTypes = {
  exitFullScreen: PropTypes.func.isRequired,
};

export default WaitListTableHeader;
