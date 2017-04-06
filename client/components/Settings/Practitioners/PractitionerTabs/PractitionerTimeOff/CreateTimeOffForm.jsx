
import React, { Component, PropTypes } from 'react';
import { Form, Field, IconButton } from '../../../../library';

class CreateTimeOffForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOff, formName, handleSubmit, deleteTimeOff } = this.props;

    let initialValues = {};
    let showDeleteButton = null;

    if (timeOff) {
      initialValues = {
        startDate: timeOff.get('startDate'),
        endDate: timeOff.get('endDate'),
      };
      showDeleteButton = (
        <IconButton icon="trash" onClick={deleteTimeOff} />
      );
    }

    return (
      <div>
        {showDeleteButton}
        <Form
          form={formName}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          <Field
            component="Calendar"
            name="startDate"
            label="Start Date"
          />
          <Field
            component="Calendar"
            name="endDate"
            label="End Date"
          />
        </Form>
      </div>
    );
  }
}

CreateTimeOffForm.PropTypes = {

};

export default CreateTimeOffForm;
