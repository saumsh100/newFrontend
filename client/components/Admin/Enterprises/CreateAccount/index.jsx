import React, { Component, PropTypes } from 'react';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import AddUser from './AddUser';
import Button from '../../../library/Button/index';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      index: 0,
      values: [],
    };
  }

  next(values, index, formName) {

    const newValues = this.state.values;

    newValues[index] = values;

    this.setState({
      index: index + 1,
      values: newValues,
    });
  }

  previous(index) {
    this.setState({
      index: index - 1,
    });
  }

  render() {
    const {
      submit,
    } = this.props;

    const formNames = ['clinicDetails', 'addUser'];

    const formList = [
      {
        title: 'Clinic Details',
        component: ClinicDetails({
          onSubmit: this.next,
          index: 0,
          initialValues: this.state.values[0],
          formName: formNames[0],
        }),
      },
      {
        title: 'Add New User',
        component: AddUser({
          onSubmit: this.next,
          index: 1,
          initialValues: this.state.values[1],
          formName: formNames[1],
        }),
      },
    ];

    return (
      <div key={this.state.index} >
        <span>{formList[this.state.index].title}</span>
        <div>
          {formList[this.state.index].component}
        </div>
        {this.state.index ? <Button onClick={() => this.previous(this.state.index)} >
          Previous </Button>
          : null }
        <Button
          onClick={() => {
            submit(formNames[this.state.index]);
          }}
        >
          Next
        </Button>
      </div>
    );
  }
}


function mapActionsToProps(dispatch) {
  return bindActionCreators({
    submit,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);
export default enhance(CreateAccount);
