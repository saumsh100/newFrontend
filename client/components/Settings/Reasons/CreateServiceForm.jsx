
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Field } from '../../library';
import styles from './styles.scss';

const parseNum = value => value && parseInt(value, 0);

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength25 = maxLength(35);

const notNegative = value => (value && value <= 0 ? 'Must be greater than 0' : undefined);

const maxDuration = value =>
  (value && value > 180 ? 'Must be less than or equal to 180' : undefined);

export default function CreateServiceForm(props) {
  const { onSubmit, formName } = props;
  return (
    <Row className={styles.formContainer__createForm}>
      <Col xs={12}>
        <Form form={formName} onSubmit={onSubmit} data-test-id="createServiceForm" ignoreSaveButton>
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
        </Form>
      </Col>
    </Row>
  );
}

CreateServiceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
};
