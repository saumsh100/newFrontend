
import React, { Component, PropTypes } from 'react';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import ContactDetails from './ContactDetails';
import AddUser from './AddUser';
import AddEnterprise from './AddEnterprise';
;import EnterpriseList from './EnterpriseList';
import SelectAccountOptions from './SelectAccountOptions';
import { Button, ListBullets, Icon } from '../../../library';
import { setAllAccountInfo } from '../../../../thunks/admin';
import styles from './styles.scss';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.setEnterprise = this.setEnterprise.bind(this);
    this.setCreate = this.setCreate.bind(this);

    this.state = {
      create: false,
      formLength: 4,
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

  previous() {
    if (this.state.index === 1 || (!this.state.index && this.state.create)) {
      const resetValue = this.state.values;
      resetValue[0] = {}
      this.setState({
        index: 0,
        create: false,
        values: resetValue,
      })
    } else {
      this.setState({
        index: this.state.index - 1,
      });
    }
  }

  setEnterprise(enterprise) {
    const newValues = this.state.values;
    newValues[0] = enterprise;
    this.setState({
      values: newValues,
      index: 1,
    });
  }

  setCreate() {
    this.setState({
      create: !this.state.create,
      index: 0,
    });
  }


  render() {
    const {
      submit,
      enterprises,
    } = this.props;

    const formNames = ['addEnterprise', 'clinicDetails', 'selectAccountOptions', 'addUser'];

    const component = this.state.create ? (
      AddEnterprise({
        onSubmit: this.next,
        index: 0,
        initialValues: this.state.values[0],
        formName: formNames[0],
      })) : (
        <EnterpriseList
          enterprises={enterprises}
          onSubmit={this.next}
          index={0}
          setCreate={this.setCreate}
        />);

    const formList = [
      {
        title: this.state.create ? 'Add Enterprise' : 'Select or Add Enterprise',
        component,
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
        title: 'Select Account Options',
        component: SelectAccountOptions({
          onSubmit: this.next,
          index: 2,
          initialValues: this.state.values[2],
          formName: formNames[2],
        }),
      },
      {
        title: 'Add New User',
        component: AddUser({
          onSubmit: this.next,
          index: 3,
          initialValues: this.state.values[3],
          formName: formNames[3],
        }),
      },
    ];

    console.log(this.state.values);

    return (
      <div key={this.state.index} className={styles.mainContainer}>
        <div className={styles.header}>
          {formList[this.state.index].title}
          <div className={styles.header_icon}>
            <Icon icon="times" onClick={()=>this.props.setActive()} />
          </div>
        </div>
        <div className={styles.formContainer}>
          {formList[this.state.index].component }
        </div>
        <div className={styles.buttonContainer}>
          {this.state.index || this.state.create ? (
            <Button
              onClick={() => this.previous()}
            >
              Previous
            </Button>) : null }

          {(this.state.formLength - 1 > this.state.index) && (this.state.index >= 1 || this.state.create)?
            (<Button
              onClick={() => {
                submit(formNames[this.state.index]);
              }}
              className={styles.nextButton}
            >
              Next
            </Button>)
          : null }

          {this.state.formLength - 1 === this.state.index ? (
            <Button
              onClick={() => {
                submit(formNames[this.state.index])
                this.props.setAllAccountInfo({ formData: this.state.values });
                this.props.setActive();
              }}
              className={styles.nextButton}
            >
              Submit All
            </Button>
            ) : null }
        </div>
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
