
import React, { useState } from 'react';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import Patient from '../../../../../entities/models/Patient';
import { Button } from '../../../../library';
import styles from './styles.scss';

const PatientTooltip = ({ patients, suffix }) => {
  const { length } = patients;
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen(prevState => !prevState);
  return (
    <div className={styles.patientWrapper}>
      <Popover
        isOpen={isOpen}
        body={
          <div className={styles.tooltipWrapper}>
            {patients.map(({ patientData }) => (
              <div className={styles.patientName} key={patientData.id}>
                {`${patientData.firstName} ${patientData.lastName}`}
              </div>
            ))}
          </div>
        }
        preferPlace="below"
        tipSize={0.01}
        className={styles.tooltip_Popover}
        onOuterAction={toggleIsOpen}
      >
        <Button className={styles.patientTooltip} onClick={() => setIsOpen(true)}>
          {length} patient{length > 1 ? 's' : null}
        </Button>
      </Popover>
      {suffix}
    </div>
  );
};

PatientTooltip.propTypes = {
  patients: PropTypes.arrayOf(PropTypes.instanceOf(Patient)),
  suffix: PropTypes.string,
};

PatientTooltip.defaultProps = {
  patients: [],
  suffix: '',
};

export default PatientTooltip;
