import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Icon } from '../../../../../library';

const WaitlistSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className={styles.waitlistSearchInputWrapper}>
      <Icon className={styles.waitlistSearchInputIcon} icon="search" type="regular" />
      <input
        id="waitlist-search"
        icon="search"
        className={styles.waitlistSearchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter by Name"
      />
    </div>
  );
};

WaitlistSearch.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default WaitlistSearch;
