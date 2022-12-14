import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Avatar, Icon } from '../../library';
import styles from './styles.scss';

export default function DisplaySearchedPatient(props) {
  const { patient, disabled } = props;

  return (
    <div>
      {patient ? (
        <div
          className={classNames(styles.patientContainer, {
            [styles.disablePatientContainer]: disabled,
          })}
          onClick={() => {
            if (!disabled) {
              props.setShowInput(true);
              props.setPatientSearched(null);
            }
          }}
        >
          <Avatar user={patient} size="sm" />
          <div className={styles.patientContainer_name}>
            {patient.firstName} {patient.lastName}
          </div>
          <div className={styles.patientContainer_icon}>
            <Icon icon="search" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

DisplaySearchedPatient.propTypes = { patient: PropTypes.object, disabled: PropTypes.bool };

DisplaySearchedPatient.defaultProps = {
  disabled: false,
};
