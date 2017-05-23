
import React, { Component, PropTypes } from 'react';
import { Checkbox } from '../../../../library';

import styles from '../styles.scss';

export default function FilterEntities(props) {

  const {
    display,
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
      <div className={styles.filter_options__checkLabel}>
        <Checkbox
          checked={allChecked}
          onChange={ () => handleAllCheck(filterKey)}
        />
        <span className={styles.filter_options__checkLabel__all}>All</span>
      </div>
      {entities.map((entity) => {
        const checked = selectedFilterItem.indexOf(entity.get('id')) > -1;
        return (
          <div className={styles.filter_options__checkLabel}>
            <Checkbox
              key={entity.get(display)}
              checked={checked}
              onChange={() => handleEntityCheck(checked, entity.get('id'), filterKey)}
            />
            {entity.get(display)}
          </div>

        );
      })}
    </div>
  )
}
