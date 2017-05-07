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

  console.log(selectedFilterItem);

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

        let hideCheck = checked;
        if (hideCheck && allChecked) {
          hideCheck = false;
        }

        return (
          <Checkbox
            key={entity.get(display)}
            label={entity.get(display)}
            checked={hideCheck}
            onChange={() => handleEntityCheck(checked, entity.get('id'), filterKey, hideCheck)}
          />
        );
      })}
    </div>
  )
}
