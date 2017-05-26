
import React, { Component, PropTypes } from 'react';
import { Checkbox } from '../../../../library';

import styles from '../styles.scss';

export default function FilterServices(props) {

  const {
    display,
    label,
    filterKey,
    allChecked,
    entities,
    practitioners,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
    selectedPractitioners,
  } = props;


  let filteredServices = [];

  selectedPractitioners.map((pracId) => {
    const selectedPrac = practitioners.get(pracId);
    if (selectedPrac) {
      const serviceIds = selectedPrac.get('services');
      serviceIds.map((sid) => {
        filteredServices.push(entities.get(sid))
      });
    }
  });


  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>{label}</div>
      {filteredServices.length && <div className={styles.filter_options__checkLabel}>
          <Checkbox
          checked={allChecked}
          onChange={() => handleAllCheck(filterKey)}
        />
        <span className={styles.filter_options__checkLabel__all}>All</span>
      </div>}
      {filteredServices.map((entity) => {
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
