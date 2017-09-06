import React, { Component, PropTypes } from 'react';
import ClinicDetails from './ClinicDetails';
import AddUser from './AddUser';
import Button from '../../../library/Button/index';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      index: 0,
      values: {},
    };
  }

  handleSubmit(values, index) {
    this.setState({
      index: index + 1,
      values: Object.assign({}, this.state.values, values),
    });
  }

  previous(index) {
    this.setState({
      index: index - 1,
    });
  }

  render() {
    const formList = [
      {
        title: 'Clinic Details',
        component: ClinicDetails({
          onSubmit: this.handleSubmit,
          index: 0,
          previous: this.previous,
          initialValues: this.state.values,
        }),
      },
      {
        title: 'Add New User',
        component: AddUser({
          onSubmit: this.handleSubmit,
          index: 1,
          previous: this.previous,
          initialValues: this.state.values,
        }),
      },
    ];

    return (
      <div key={this.state.index} >
        {formList[this.state.index].title}
        <div>
          {formList[this.state.index].component}
        </div>
      </div>
    );
  }
}

export default CreateAccount;
