import PropTypes from 'prop-types';
import React from 'react';
import { Field } from '../../../../library';
import styles from './styles.scss';

const PractServicesList = (props) => {
  const { service, index } = props;

  let showComponent = null;

  if (service) {
    showComponent = (
      <div className={styles.formContainer_service} data-test-id={`${service.get('name')}Toggle`}>
        <span className={styles.formContainer_service_name}>{service.get('name')}</span>
        <div
          className={styles.formContainer_service_toggle}
          data-test-id={`toggle_pracService_${index}`}
        >
          <Field component="Toggle" name={service.get('id')} />
        </div>
      </div>
    );
  }
  return <div>{showComponent}</div>;
};

PractServicesList.propTypes = {
  service: PropTypes.shape({
    get: PropTypes.func,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default PractServicesList;
