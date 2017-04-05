import React, { Component, PropTypes } from 'react';
import { Form, Field, Calendar } from '../../../../library';

class CreateTimeOff extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    console.log(values);
  }

  render() {
    return (
      <Form
        form="createTimeOff"
        onSubmit={this.handleSubmit}
      >
        <Field
          component="Calendar"
          name="startTime"
          label="Start Time"
        />
      </Form>
    );
  }
}

CreateTimeOff.PropTypes = {

};

export default CreateTimeOff;
