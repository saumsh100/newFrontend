import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';
import styles from '../styles.scss'
import { emailValidate } from '../../../../library/Form/validate';

class EditRemindersForm extends Component {

  render() {
    const { sendEdit, formName, initialValues = {} } = this.props;
    const intValues = {
      primaryType: initialValues.primaryType,
      lengthHours: initialValues.lengthSeconds / 60 / 60,
    };

    const options = [
      {
        value: 'sms',
      },
      {
        value: 'phone',
      },
      {
        value: 'email',
      },
    ];

    return (
      <Form
        form={formName}
        onSubmit={sendEdit}
        ignoreSaveButton
        initialValues={intValues}
        data-test-id={formName}
      >
        <div className={styles.formContainer} >
          <Field
            required
            type="number"
            name="lengthHours"
            label="Length Hours"
            data-test-id="lengthHours"
          />
          <div className={styles.formContainer_select} >
            <Field
              required
              component="DropdownSelect"
              options={options}
              name="primaryType"
              label="Primary Type"
              data-test-id="primaryType"
            />
          </div>
        </div>
      </Form>
    );
  }
}

EditRemindersForm.propTypes = {
  formName: PropTypes.string,
  sendEdit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};


export default EditRemindersForm;
