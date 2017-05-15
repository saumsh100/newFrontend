
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col, Field,  } from '../../library';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import styles from './styles.scss';
import { change, }  from 'redux-form';

class PatientForm extends Component {
  constructor(props) {
   super(props);
   this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
  }

  handleAutoSuggest(e, newValue, previousValue) {
    const {
      change,
    } = this.props;

    if (typeof newValue === 'object') {
      change("NewAppointmentForm", 'patient.phoneNumber', newValue.phoneNumber)
      change("NewAppointmentForm", 'patient.email', newValue.email)
    }
  }

  render() {
    const {
      getSuggestions,
      handleSubmit,
    } = this.props;

    const remoteButtonProps = {
      onClick: handleSubmit,
      form: "NewAppointmentForm",
    };

    return (
      <Grid className={styles.addNewAppt_mainContainer_right}>
        <Row className={styles.addNewAppt_mainContainer_right_row}>
          <Col xs={12}>
            <Field
              component="AutoComplete"
              name="selectedPatient"
              label="Patient Name"
              getSuggestions={getSuggestions}
              onChange={this.handleAutoSuggest}
              required
            />
          </Col>
        </Row>
        <Row className={styles.addNewAppt_mainContainer_right_row}>
          <Col xs={12}>
            <Field
              name="phoneNumber"
              label="Phone #"
              required
            />
          </Col>
        </Row>
        <Row className={styles.addNewAppt_mainContainer_right_row}>
          <Col xs={12} >
            <Field
              name="email"
              label="Email"
              required
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    change,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientForm);
