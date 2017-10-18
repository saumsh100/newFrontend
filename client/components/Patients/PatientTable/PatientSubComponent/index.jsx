import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';

class PatientSubComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      patient,
    } = this.props;

    return (
      <div className={styles.patientSub}>
        <div className={styles.content}>
          {patient.firstName}
        </div>
      </div>
    )
  }
}

export default PatientSubComponent;
