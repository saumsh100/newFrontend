
import React, { PropTypes, Component } from 'react';
import {
  Form,
  Field,
  Grid,
  Row,
  Col,
} from '../../../../library';
import styles from './styles.scss'

const primaryTypesOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  // { label: 'Voice', value: 'phone' },
  { label: 'Email & SMS', value: 'email_sms' }
];

const intervalOptions = [
  { label: 'Months', value: 'months' },
  { label: 'Weeks', value: 'weeks' },
];

const typeOptions = [
  { label: 'Before Due Date', value: 'before' },
  { label: 'After Due Date', value: 'after' }
];

class CreateRecallsForm extends Component {
  render() {
    const { sendEdit, formName } = this.props;
    const intValues = {
      primaryType: 'email_sms',
      number: 2,
      interval: 'weeks',
      type: 'before',
    };

    return (
      <Form
        form={formName}
        onSubmit={sendEdit}
        ignoreSaveButton
        initialValues={intValues}
        data-test-id={formName}
      >
        <Field
          required
          component="DropdownSelect"
          options={primaryTypesOptions}
          name="primaryType"
          // label="Communication Type"
          data-test-id="primaryType"
        />
        <Grid>
          <Row>
            <Col xs={3}>
              <Field
                required
                type="number"
                name="number"
                // label="Number"
                data-test-id="number"
              />
            </Col>
            <Col xs={3} className={styles.rightCol}>
              <Field
                required
                component="DropdownSelect"
                options={intervalOptions}
                name="interval"
                data-test-id="interval"
              />
            </Col>
            <Col xs={6} className={styles.rightCol}>
              <Field
                required
                name="type"
                component="DropdownSelect"
                options={typeOptions}
                // label="Type"
                data-test-id="type"
              />
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

CreateRecallsForm.propTypes = {
  formName: PropTypes.string,
  sendEdit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};


export default CreateRecallsForm;
