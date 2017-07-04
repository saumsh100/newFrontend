import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';

class EditRecallsForm extends Component {

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
      >
        <Field
          required
          type="number"
          name="lengthHours"
          label="Length Hours"
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
