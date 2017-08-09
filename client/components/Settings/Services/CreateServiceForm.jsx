import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';


const parseNum = value => value && parseInt(value);

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(35);

const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;

const maxDuration = value => value && value > 180 ? 'Must be less than or equal to 180' : undefined;

export default function CreateServiceForm(props) {
  const { onSubmit, formName } = props;
  return (
  <Row className={styles.formContainer__createForm}>
    <Col xs={12}>
    <Row className={styles.servicesFormRow__createRow}>
      <CardHeader title="Create New Service" />
    </Row>
      <Form
        form={formName}
        onSubmit={onSubmit}
        data-test-id="createServiceForm"
        ignoreSaveButton
      >
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="name"
              label="Name"
              validate={[maxLength25]}
              data-test-id="name"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="duration"
              label="Duration"
              type="number"
              validate={[notNegative, maxDuration]}
              normalize={parseNum}
              data-test-id="duration"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
              <Field
                required
                name="bufferTime"
                label="Buffer Time"
                type="number"
                validate={[notNegative, maxDuration]}
                normalize={parseNum}
                data-test-id="bufferTime"
              />
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
  );
}

CreateServiceForm.propTypes = {
  onSubmit: PropTypes.func,
};

