
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { List, ListItem } from '../../../../library';
import styles from './styles.scss';

export default function SmartFilters(props) {
  const {
    handleSubmit,
    addFilterToTable,
    setSmartFilter,
  } = props;
  const smartFilters = [
    {
      label: 'Due within 60 Days',
    },
    {
      label: '0-3 Months Late',
    },
    {
      label: '4-6 Months Late',
    },
    {
      label: 'Missed/Cancelled',
    },
    {
      label: 'Unconfirmed Patients one week',
    },
  ];

  return (
    <List className={styles.smartFilter}>
      {smartFilters.map((filter, index) => {
        return (
          <ListItem className={styles.filterItem} onClick={() => setSmartFilter(index)}>
            {filter.label}
          </ListItem>
        );
      })}
    </List>
  );
}
