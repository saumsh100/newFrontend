
import React, { Component, PropTypes } from 'react';
import { Checkbox } from '../../../../library';
import styles from '../styles.scss';

export default function FilterReminders(props) {

  const {
    entities,
    allChecked,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;


  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>Reminders</div>
      <Checkbox
        label={'All'}
        checked={allChecked}
        onChange={() => handleAllCheck('remindersFilter')}
      />
      {entities.map((entity, index) => {
        const checked = selectedFilterItem.indexOf(entity.get('id')) > -1;
        console.log(selectedFilterItem)
        return (
          <Checkbox
            key={`reminders_${index}`}
            label={entity.get('id')}
            checked={checked}
            onChange={() => handleEntityCheck(checked, entity.get('id'), 'remindersFilter')}
          />
        );
      })}
    </div>
  )
}
