
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field } from '../../../library';
import styles from '../styles.scss';

class ServicesPractList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { practitioner, index } = this.props;

    return (
      <div
        className={styles.servicesPractForm_service}
        data-test-id={`${practitioner.get('firstName')}${practitioner.get('lastName')}`}
      >
        <span className={styles.servicesPractForm_service_text}>
          {practitioner.getFullName()}
        </span>
        <div
          className={styles.servicesPractForm_service_toggle}
          data-test-id={`toggle_prac_${index}`}
        >
          <Field component="Toggle" name={practitioner.get('id')} />
        </div>
      </div>
    );
  }
}

export default ServicesPractList;
