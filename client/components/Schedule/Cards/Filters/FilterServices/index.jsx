import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import Checkbox from '../../../../library';

function getServicesForPractitioner(serviceIds, services) {
  return services.map(s => {
    return serviceIds.indexOf(s.get('id')) > -1;
  })
}

export default function FilterServices(props) {
  const {
    practitioners,
    services,
  } = props;

  const filteredServices = practitioners.map((p) => {
    return p.get('services').toJS();
  });

  return (
    <div className={styles.filter_options__item}>
      <div className={styles.filter_options__title}>Services:</div>
        {services.map((s) => {
          return (
            <span>{s.get('name')}</span>
          );
        })}
    </div>
  );
}
