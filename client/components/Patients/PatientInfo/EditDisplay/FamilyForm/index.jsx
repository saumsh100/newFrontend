
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function FamilyForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <div className={styles.disabledPage}>
      <div className={styles.disabledPage_text}>
        Patient Family has been disabled. Please contact your Carecru account manager for further assistance.
      </div>
    </div>
  )
}
