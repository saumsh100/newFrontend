import React, { Component, PropTypes } from 'react';
import { Checkbox } from '../../../../library';

import styles from '../styles.scss';

export default function FilterAppointments(props) {

  const {
    label,
    filterKey,
    allChecked,
    entities,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>{label}</div>
      <Checkbox
        label={'All'}
        checked={allChecked}
        onChange={ () => handleAllCheck(filterKey)}
      />
      {entities.map((entity) => {
        const checked = selectedFilterItem.indexOf(entity.get('id')) > -1;

        return (
          <Checkbox
            key={entity.get('id')}
            label={entity.get('note')}
            checked={checked}
            onChange={() => handleEntityCheck(checked, entity.get('id'), filterKey)}
          />
        );
      })}
    </div>
  )
}
