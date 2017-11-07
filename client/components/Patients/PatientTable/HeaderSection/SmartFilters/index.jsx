
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { List, ListItem } from '../../../../library';
import styles from './styles.scss';

export default function SmartFilters(props) {
  const {
    handleSubmit,
    addFilterToTable,
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
      startMonth: 6,
      endMonth: 4,
    },
    {
      index: 0,
      label: '0-3 Months Late',
      startMonth: 9,
      endMonth: 6,
    },
    {
      index: 0,
      label: '4-6 Months Late',
      startMonth: 12,
      endMonth: 10,
    },
    {
      index: 0,
      label: '7-12 Months Late',
      startMonth: 18,
      endMonth: 13,
    },
    {
      index: 0,
      label: '13-18 Months Late',
      startMonth: 24,
      endMonth: 19,
    },
    {
      index: 0,
      label: '19-24 Months Late',
      startMonth: 30,
      endMonth: 25,
    },
    {
      index: 0,
      label: '25-36 Months Late',
      startMonth: 42,
      endMonth: 31,
    },
    {
      index: 1,
      label: 'Missed/Cancelled',
      joinFilter: true,
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
      {smartFilters.map((filter, index) => {

        let borderStyle = { };
        if (smartFilter && filter.label === smartFilter.label) {
          borderStyle = {
            borderLeft: '5px solid #FF715A',
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
