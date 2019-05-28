
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Field, Form, Grid, Row } from '../../../../library';
import styles from './styles.scss';

const primaryTypesOptions = [
  { label: 'Email',
    value: 'email' },
  { label: 'SMS',
    value: 'sms' },
  { label: 'Voice',
    value: 'phone' },
  { label: 'Email & SMS',
    value: 'email_sms' },
];

const typeOptions = [{ value: 'hours',
  label: 'Hours' }, { value: 'days',
  label: 'Days' }];

const CreateRemindersForm = ({ sendEdit, formName }) => (
  <Form
    form={formName}
    onSubmit={sendEdit}
    ignoreSaveButton
    initialValues={{
      primaryType: 'sms',
      number: 2,
      type: 'hours',
    }}
    data-test-id={formName}
  >
    <Field
      required
      component="DropdownSelect"
      options={primaryTypesOptions}
      name="primaryType"
      data-test-id="primaryType"
    />
    <Grid>
      <Row>
        <Col xs={3}>
          <Field required type="number" name="number" data-test-id="number" />
        </Col>
        <Col xs={9} className={styles.rightCol}>
          <Field
            required
            name="type"
            component="DropdownSelect"
            options={typeOptions}
            data-test-id="type"
          />
        </Col>
      </Row>
    </Grid>
  </Form>
);

CreateRemindersForm.propTypes = {
  formName: PropTypes.string.isRequired,
  sendEdit: PropTypes.func.isRequired,
};

export default CreateRemindersForm;
