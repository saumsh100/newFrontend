
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Field,  } from '../../library';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import styles from './styles.scss';

function PatientForm(props) {
  const {
    getSuggestions,
    handleSubmit,
    values
  } = props;

  const remoteButtonProps = {
    onClick: handleSubmit,
    form: "NewAppointmentForm",
  };

  console.log(values);
  return (
    <Grid className={styles.addNewAppt_mainContainer_right}>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            component="AutoComplete"
            name="patientId"
            label="Patient Name"
            getSuggestions={getSuggestions}
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            name="phone"
            label="Phone #"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} >
          <Field
            name="email"
            label="Email"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} className={styles.addNewAppt_col_textArea} >
          <Field
            component="TextArea"
            name="comment"
            label="Comment"
            rows={6}
            className={styles.addNewAppt_comment}
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} style={{padding: '90px'}}>
         <RemoteSubmitButton
           {...remoteButtonProps}
         >
           Save
         </RemoteSubmitButton>
        </Col>
      </Row>
    </Grid>
  );
}


function mapStateToProps({ form }) {
  // form data is populated when component renders
  if (!form["NewAppointmentForm"]) {
    return {
      values: {},
    };
  }

  return {
    values: form["NewAppointmentForm"].values,
  };
}


export default connect(mapStateToProps,null)(PatientForm);
