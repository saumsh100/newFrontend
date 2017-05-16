
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col, Field } from '../../library';
import styles from './styles.scss';
import { change } from 'redux-form';

function validatePatient(value) {
  return (value && (typeof value !== 'object')) ? 'No Patient With That Name' : undefined;
}

class PatientForm extends Component {
  constructor(props) {
   super(props);
   this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
  }

  handleAutoSuggest(e, newValue, previousValue) {
    const {
      change,
      formName,
    } = this.props;

    if (typeof newValue === 'object') {
      change(formName, 'patient.phoneNumber', newValue.phoneNumber);
      change(formName, 'patient.email', newValue.email);
    }
  }

  render() {
    const {
      getSuggestions,
    } = this.props;

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
              validate={[validatePatient]}
              required
            />
          </Col>
        </Row>
        <Row className={styles.addNewAppt_mainContainer_right_row}>
          <Col xs={12}>
            <Field
              name="phoneNumber"
              label="Phone #"
              disabled
            />
          </Col>
        </Row>
        <Row className={styles.addNewAppt_mainContainer_right_row}>
          <Col xs={12} >
            <Field
              name="email"
              label="Email"
              disabled
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
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    change,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(PatientForm);
