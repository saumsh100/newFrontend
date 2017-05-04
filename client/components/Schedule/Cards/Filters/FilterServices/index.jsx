import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import { Checkbox } from '../../../../library';

export default function FilterServices(props) {

  const {
    selectedFilterServices,
    services,
    addScheduleFilter,
    removeScheduleFilter,
  } = props;

  const serviceIds = selectedFilterServices.map(service => service.id);

  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>Services:</div>
      {services.map((s) => {
        const checked = serviceIds.indexOf(s.get('id')) > -1;
        return (
          <Checkbox
            label={s.get('name')}
            checked={checked}
            onChange={() => { checked ? removeScheduleFilter({ key: 'servicesFilter', id: s.get('id') }) : addScheduleFilter({ key: 'servicesFilter', entity: s }); }}
          />
        );
      })}
    </div>
  );

}

FilterServices.PropTypes = {
  services: PropTypes.Object,
  selectedFilterServices: PropTypes.arrayOf(Object),
};
