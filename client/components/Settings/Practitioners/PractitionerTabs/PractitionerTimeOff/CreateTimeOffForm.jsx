import React, { Component, PropTypes } from 'react';
import { Form, Field, Calendar } from '../../../../library';

class CreateTimeOffForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { practitioner } = this.props;
    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: new Date(values.startDate.trim()),
      endDate: new Date(values.endDate.trim()),
    };

    this.props.createEntityRequest({ key: 'timeOffs', entityData: trimValues });
    this.props.setActive();
  }

  render() {
    const { practitioner } = this.props;

    return (
      <Form
        form={`${practitioner.get('id')}_createTimeOff`}
        onSubmit={this.handleSubmit}
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
    );
  }
}

CreateTimeOffForm.PropTypes = {

};

export default CreateTimeOffForm;
