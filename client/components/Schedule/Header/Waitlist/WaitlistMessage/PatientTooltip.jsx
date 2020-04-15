
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../Tooltip';
import Patient from '../../../../../entities/models/Patient';
import styles from './styles.scss';

const PatientTooltip = ({ patients }) => {
  const len = patients.length;

  if (len === 0) return null;
  return (
    <Tooltip
      body={
        <>
          {patients.map(entity => (
            <div className={styles.patientName} key={entity.id}>
              {entity.getFullName()}
            </div>
          ))}
        </>
      }
      placement="below"
      tipSize={0.01}
    >
      <span className={styles.patientTooltip}>
        {len} patient{len > 1 ? 's' : null}
      </span>
    </Tooltip>
  );
};

PatientTooltip.propTypes = {
  patients: PropTypes.arrayOf(PropTypes.instanceOf(Patient)),
};

PatientTooltip.defaultProps = {
  patients: [],
};

export default PatientTooltip;
