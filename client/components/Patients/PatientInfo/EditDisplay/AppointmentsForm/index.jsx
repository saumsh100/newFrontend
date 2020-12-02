
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import { isResponsive } from '../../../../../util/hub';
import PatientModel from '../../../../../entities/models/Patient';
import styles from '../styles.scss';

function AppointmentsForm(props) {
  const { handleSubmit, inputStyle, patient, timezone } = props;

  const {
    dueForHygieneDate,
    dueForRecallExamDate,
    lastRecallDate,
    lastHygieneDate,
  } = patient.toJS();
  const initialValues = {
    dueForHygieneDate,
    dueForRecallExamDate,
    lastRecallDate,
    lastHygieneDate,
  };

  return (
    <Form
      form="Form1"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      initialValues={initialValues}
      ignoreSaveButton={!isResponsive()}
    >
      <Grid className={styles.grid}>
        <div className={styles.formHeader}>Last Appointment</div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="lastRecallDate"
              label="Recall"
              component="DayPicker"
              theme={inputStyle}
              timezone={timezone}
            />
          </Col>
          <Col xs={6}>
            <Field
              component="DayPicker"
              name="lastHygieneDate"
              label="Hygiene"
              theme={inputStyle}
              timezone={timezone}
            />
          </Col>
        </Row>
        <div className={styles.formHeader}>Continuing Care</div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="dueForHygieneDate"
              label="Due for Hygiene"
              component="DayPicker"
              theme={inputStyle}
              timezone={timezone}
            />
          </Col>
          <Col xs={6}>
            <Field
              component="DayPicker"
              name="dueForRecallExamDate"
              label={isResponsive() ? 'Due for Recall' : 'Due for Recall Exam'}
              theme={inputStyle}
              timezone={timezone}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AppointmentsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  inputStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
  patient: PropTypes.instanceOf(PatientModel),
  timezone: PropTypes.string.isRequired,
};

AppointmentsForm.defaultProps = {
  patient: null,
  inputStyle: '',
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(
  mapStateToProps,
  null,
)(AppointmentsForm);
