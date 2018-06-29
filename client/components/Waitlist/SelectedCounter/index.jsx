
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function SelectedCounter({ selected }) {
  if (selected.length === 0) return null;

  const patientText = selected.length === 1 ? 'Patient' : 'Patients';

  const fullText = `${selected.length} ${patientText} Selected`;

  return (
    <div className={styles.container}>
      <p>{fullText}</p>
    </div>
  );
}

SelectedCounter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
};
