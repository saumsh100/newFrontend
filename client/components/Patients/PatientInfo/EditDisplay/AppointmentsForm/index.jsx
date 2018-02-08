
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';
import FormSection from '../../../../library/Form/FormSection';

export default function AppointmentsForm(props) {
  const {
    handleSubmit,
  } = props;

  const theme = {
    input: styles.inputBarStyle,
  };

  return (
    <Form
      form="Form1"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <FormSection name="Last Appointment">
          <div className={styles.formHeader}> Last Appointment </div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="recall"
                label="Recall"
                component="DayPicker"
                theme={theme}
              />
            </Col>
            <Col xs={6} >
              <Field
                component="DayPicker"
                name="hygiene"
                label="Hygiene"
                theme={theme}
              />
            </Col>
          </Row>
        </FormSection>
        <FormSection name="Continuing Care">
          <div className={styles.formHeader}> Continuing Care </div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="recall"
                label="Recall"
                component="DayPicker"
                theme={theme}

              />
            </Col>
            <Col xs={6} >
              <Field
                component="DropdownSelect"
                name="hygiene"
                label="Hygiene"
                options={[]}
                theme={props.dropDownStyle}
              />
            </Col>
          </Row>
        </FormSection>
      </Grid>
    </Form>
  );
}

AppointmentsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
