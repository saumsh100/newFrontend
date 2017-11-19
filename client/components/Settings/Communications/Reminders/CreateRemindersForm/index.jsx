
import React, { PropTypes, Component } from 'react';
import {
  Form,
  Field,
  Grid,
  Row,
  Col,
} from '../../../../library';
import styles from './styles.scss'
import { emailValidate } from '../../../../library/Form/validate';

const options = [
  {
    value: 'sms',
    label: 'SMS',
  },
  {
    value: 'phone',
    label: 'Phone',
  },
  {
    value: 'email',
    label: 'Email',
  },
];

const typeOptions = [
  {
    value: 'hours',
    label: 'Hours',
  },
  {
    value: 'days',
    label: 'Days',
  },
];

class CreateRemindersForm extends Component {
  render() {
    const { sendEdit, formName } = this.props;
    const intValues = {
      primaryType: 'sms',
      number: 2,
      type: 'hours',
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
          options={options}
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
            <Col xs={9} className={styles.rightCol}>
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

CreateRemindersForm.propTypes = {
  formName: PropTypes.string,
  sendEdit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};


export default CreateRemindersForm;
