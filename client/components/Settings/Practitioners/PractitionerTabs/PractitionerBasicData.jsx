import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, Grid, Row, Col } from '../../../library';
import styles from '../styles.scss';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);

class PractitionerBasicData extends Component {
  constructor(props) {
    super(props);
    this.updatePractitioner = this.updatePractitioner.bind(this);
  }

  updatePractitioner(values) {
    const { practitioner } = this.props;

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName.trim();

    const valuesMap = Map(values);
    const modifiedPractitioner = practitioner.merge(valuesMap);
    this.props.updatePractitioner(modifiedPractitioner);
  }

  render() {
    const { practitioner } = this.props;

    if (!practitioner) {
      return null;
    }

    const initialValues = {
      firstName: practitioner.get('firstName'),
      lastName: practitioner.get('lastName'),
    }

    return (
      <Row className={styles.practFormContainer}>
        <Col xs={6} className={styles.practForm}>
          <Form
            form={`${practitioner.get('id')}Form`}
            onSubmit={this.updatePractitioner}
            initialValues={initialValues}
          >
            <Row className={styles.practFormRow}>
              <Col xs={12}>
                <Field
                  required
                  name="firstName"
                  label="First Name"
                  validate={[maxLength25]}
                />
              </Col>
              <Col xs={12}>
                <Field
                  required
                  name="lastName"
                  label="Last Name"
                  validate={[maxLength25]}
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default PractitionerBasicData;
