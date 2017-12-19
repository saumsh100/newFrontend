
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from '../../../../library';
import styles from './styles.scss';

export default function SmartFilters(props) {
  const {
    setSmartFilter,
    smartFilter,
  } = props;

  const smartFilters = [
    {
      index: -1,
      label: 'All Patients',
    },
    {
      index: 0,
      label: 'Due within 60 Days',
      startMonth: 8,
      endMonth: 7,
    },
    {
      index: 0,
      label: '0-3 Months Late',
      startMonth: 11,
      endMonth: 9,
    },
    {
      index: 0,
      label: '4-6 Months Late',
      startMonth: 14,
      endMonth: 12,
    },
    {
      index: 0,
      label: '7-12 Months Late',
      startMonth: 20,
      endMonth: 15,
    },
    {
      index: 0,
      label: '13-18 Months Late',
      startMonth: 26,
      endMonth: 21,
    },
    {
      index: 0,
      label: '19-24 Months Late',
      startMonth: 32,
      endMonth: 27,
    },
    {
      index: 0,
      label: '25-36 Months Late',
      startMonth: 44,
      endMonth: 33,
    },
    {
      index: 1,
      label: 'Missed/Cancelled',
    },
    {
      index: 2,
      label: 'Missed Pre-Appointed',
    },
    {
      index: 3,
      label: 'Unconfirmed Patients 1 week',
      days: 7,
    },
    {
      index: 3,
      label: 'Unconfirmed Patients 2 weeks',
      days: 14,
    },
  ];


  return (
    <List className={styles.smartFilter}>
      {smartFilters.map((filter) => {
        let borderStyle = {};

        if ((smartFilter && filter.label === smartFilter.label) || (filter.label === 'All Patients' && !smartFilter)) {
          borderStyle = {
            borderLeft: '3px solid #FF715A',
          };
        }

        return (
          <ListItem className={styles.filterItem} onClick={() => setSmartFilter(filter)} style={borderStyle}>
            {filter.label}
          </ListItem>
        );
      })}
    </List>
  );
}

SmartFilters.propTypes = {
  setSmartFilter: PropTypes.func.isRequired,
  smartFilter: PropTypes.object,
};
