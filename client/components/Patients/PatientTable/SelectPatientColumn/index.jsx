
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../library';
import styles from '../styles.scss';

const SelectPatient = ({ checked, handlePatientSelection, wrapperClassName }) => (
  <div className={wrapperClassName}>
    <Checkbox
      checked={checked}
      onChange={(e) => {
        e.stopPropagation();
        handlePatientSelection();
      }}
      theme={{ cbx: styles.cbxStyle }}
    />
  </div>
);

SelectPatient.propTypes = {
  checked: PropTypes.bool.isRequired,
  wrapperClassName: PropTypes.string,
  handlePatientSelection: PropTypes.func.isRequired,
};

SelectPatient.defaultProps = { wrapperClassName: styles.selectPatient };

export default SelectPatient;
