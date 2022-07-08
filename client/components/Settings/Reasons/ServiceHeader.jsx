import React from 'react';
import PropTypes from 'prop-types';
import { StandardButton as Button } from '../../library';
import styles from './styles.scss';

const ServiceHeader = ({ services, setActive }) => {
  return (
    <div className={styles.servicesHeader}>
      <header className={styles.servicesHeader_counter}>
        Reasons
        <div className={styles.servicesHeader_counter_badge}>{services.size}</div>
      </header>
      <Button variant="primary" icon="plus" title="Add New Reason" onClick={setActive} />
    </div>
  );
};

ServiceHeader.propTypes = {
  services: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setActive: PropTypes.func.isRequired,
};

export default ServiceHeader;
