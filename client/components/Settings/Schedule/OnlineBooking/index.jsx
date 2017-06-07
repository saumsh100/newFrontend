import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../../library';

class OnlineBooking extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    console.log(values);
  }

  render() {
    return (
      <Form
        form="selectAccountColor"
        onSubmit={this.handleSubmit}
      >
        <Field
          component="ColorPicker"
          name="backgroundColor"
        />
      </Form>
    );
  }
}

export default OnlineBooking;
