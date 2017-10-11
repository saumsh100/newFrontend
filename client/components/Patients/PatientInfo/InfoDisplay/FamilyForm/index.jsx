
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function FamilyForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="Form4"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <Row></Row>
      </Grid>
    </Form>
  )
}
