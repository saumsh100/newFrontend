
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
      startMonth: -2,
      endMonth: 0,
    },
    {
      index: 0,
      label: '0-3 Months Late',
      startMonth: 3,
      endMonth: 0,
    },
    {
      index: 0,
      label: '4-6 Months Late',
      startMonth: 6,
      endMonth: 4,
    },
    {
      index: 0,
      label: '7-12 Months Late',
      startMonth: 12,
      endMonth: 7,
    },
    {
      index: 0,
      label: '13-18 Months Late',
      startMonth: 18,
      endMonth: 13,
    },
    {
      index: 0,
      label: '19-24 Months Late',
      startMonth: 24,
      endMonth: 19,
    },
    {
      index: 0,
      label: '25-36 Months Late',
      startMonth: 36,
      endMonth: 25,
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
    <List className={styles.smartFilter} data-test-id={'smartFiltersList'}>
      {smartFilters.map((filter, index) => {
        let borderStyle = {};

        if ((smartFilter && filter.label === smartFilter.label) || (filter.label === 'All Patients' && !smartFilter)) {
          borderStyle = {
            borderLeft: '3px solid #FF715A',
          };
        }

        return (
          <ListItem
            className={styles.filterItem}
            onClick={() => setSmartFilter(filter)}
            style={borderStyle}
            data-test-id={`option_${index}`}
          >
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
