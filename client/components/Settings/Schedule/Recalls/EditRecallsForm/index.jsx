import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';

class EditRecallsForm extends Component {

  render() {
    const { sendEdit, formName, initialValues = {} } = this.props;
    const intValues = {
      primaryType: initialValues.primaryType,
      lengthMonths: Math.round(initialValues.lengthSeconds / 60 / 60 / 24 / 30),
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
      >
        <Field
          required
          type="number"
          name="lengthMonths"
          label="Length Months"
        />
        <Field
          required
          component="DropdownSelect"
          options={options}
          name="primaryType"
          label="Primary Type"
        />
      </Form>
    );
  }
}

EditRecallsForm.propTypes = {
  formName: PropTypes.string,
  sendEdit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};


export default EditRecallsForm;
