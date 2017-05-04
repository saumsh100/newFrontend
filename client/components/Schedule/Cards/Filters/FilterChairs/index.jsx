import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox } from '../../../../library';

export default function FilterChairs(props) {

  const {
    chairs,
    addScheduleFilter,
    removeScheduleFilter,
    selectedFilterChairs,
  } = props;

  const chairIds = selectedFilterChairs.map(chair => chair.id);

  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>Chairs</div>
      {chairs.map((chair) => {
        const checked = chairIds.indexOf(chair.get('id')) > -1;
        return (
          <Checkbox
            label={chair.get('name')}
            checked={checked}
            onChange={() => { checked ? removeScheduleFilter({ key: 'chairsFilter', id: chair.get('id') }) : addScheduleFilter({ key: 'chairsFilter', entity: chair }); }
            }
          />
        );
      })}
    </div>
  );

}

FilterChairs.PropTypes = {

};
