import React, { Component, PropTypes } from 'react';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import AddUser from './AddUser';
import AddEnterprise from './AddEnterprise';
import Button from '../../../library/Button/index';
import { setAllAccountInfo } from '../../../../thunks/admin';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      formLength: 3,
      index: 0,
      values: [],
    };
  }

  next(values, index) {
    const newValues = this.state.values;

    newValues[index] = values;

    const newIndex = this.state.formLength - 1 > index ? index + 1 : this.state.index;
    this.setState({
      index: newIndex,
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

    const formNames = ['addEnterprise', 'clinicDetails', 'addUser'];

    const formList = [
      {
        title: 'Add Enterprise',
        component: AddEnterprise({
          onSubmit: this.next,
          index: 0,
          initialValues: this.state.values[0],
          formName: formNames[0],
        }),
      },
      {
        title: 'Clinic Details',
        component: ClinicDetails({
          onSubmit: this.next,
          index: 1,
          initialValues: this.state.values[1],
          formName: formNames[1],
        }),
      },
      {
        title: 'Add New User',
        component: AddUser({
          onSubmit: this.next,
          index: 2,
          initialValues: this.state.values[2],
          formName: formNames[2],
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
        {this.state.formLength - 1 > this.state.index ? <Button
          onClick={() => {
            submit(formNames[this.state.index]);
          }}
        >
          Next
        </Button> : <Button
          onClick={() => {
            submit(formNames[this.state.index])
            this.props.setAllAccountInfo({ formData: this.state.values });
            this.props.setActive();
          }}
        >
          Submit All
        </Button>}
      </div>
    );
  }
}

CreateAccount.propTypes = {
  submit: PropTypes.func,
  setAllAccountInfo: PropTypes.func,
  setActive: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    submit,
    setAllAccountInfo,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);
export default enhance(CreateAccount);
