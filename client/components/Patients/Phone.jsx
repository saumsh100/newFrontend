
import React, { PropTypes } from 'react';

function Phone({ patient, patients }) {
  console.log(patient, patients)
  return (
    <div>
      Phone
    </div>
  );
}

Phone.propTypes = {
  patient: PropTypes.object,
  patients: PropTypes.object,
};

export default Phone;
