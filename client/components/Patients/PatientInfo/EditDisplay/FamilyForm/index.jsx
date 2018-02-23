
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.scss';

export default function FamilyForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <div className={styles.formContainer}>
      <div className={styles.disabledPage}>
        <div className={styles.disabledPage_text}>
          No Family Information
        </div>
      </div>
    </div>
  )
}
FamilyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
