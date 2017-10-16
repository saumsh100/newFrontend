
import React, { Component, PropTypes } from 'react';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import Address from './Address';
import AddUser from './AddUser';
import AddEnterprise from './AddEnterprise';
import EnterpriseList from './EnterpriseList';
import SelectAccountOptions from './SelectAccountOptions';
import { Button, Icon } from '../../../library';
import { setAllAccountInfo } from '../../../../thunks/admin';
import styles from './styles.scss';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.setCreate = this.setCreate.bind(this);
    this.setCountry = this.setCountry.bind(this);

    this.state = {
      create: false,
      formLength: 5,
      index: 0,
      values: [],
      country: '',
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

    if (index === this.state.formLength - 1) {
      this.props.setAllAccountInfo({ formData: newValues });
    }
  }

  previous() {
    if (this.state.index === 1 || (!this.state.index && this.state.create)) {
      this.setState({
        index: 0,
        create: false,
      })
    } else {
      this.setState({
        index: this.state.index - 1,
      });
    }
  }

  setCreate() {
    this.setState({
      create: !this.state.create,
      index: 0,
    });
  }

  setCountry(country) {
    this.setState({
      country,
    });
  }

  render() {
    const {
      submit,
      enterprises,
    } = this.props;


    const formNames = ['addEnterprise', 'clinicDetails', 'addressDetails', 'addUser', 'selectAccountOptions',];

    const component = this.state.create ? (
      AddEnterprise({
        onSubmit: this.next,
        index: 0,
        initialValues: this.state.values[0],
        formName: 'addEnterprise',
      })) : (
        <EnterpriseList
          enterprises={enterprises}
          onSubmit={this.next}
          index={0}
          setCreate={this.setCreate}
        />);

    const formList = [
      {
        title: this.state.create ? 'Add Enterprise' : 'Add or Select Enterprise',
        component,
      },
     {
        title: 'Clinic Details',
        component: ClinicDetails({
          onSubmit: this.next,
          index: 1,
          initialValues: this.state.values[1],
          formName: formNames[1],
          setCountry: this.setCountry,
          country: this.state.country,
        }),
      },
      {
        title: 'Address',
        component: Address({
          onSubmit: this.next,
          index: 2,
          initialValues: this.state.values[2],
          formName: formNames[2],
          setCountry: this.setCountry,
          country: this.state.country,
        }),
      },
      {
        title: 'Add Owner User',
        component: AddUser({
          onSubmit: this.next,
          index: 3,
          initialValues: this.state.values[3],
          formName: formNames[3],
        }),
      },
      {
        title: 'Select Account Options',
        component: SelectAccountOptions({
          onSubmit: this.next,
          index: 4,
          initialValues: this.state.values[4],
          formName: formNames[4],
        }),
      },
    ];

    const overFlowStyle = {
      overflow: 'auto',
    };

    const style = this.state.index > 0 ? overFlowStyle : {};

    return (
      <div key={this.state.index} className={styles.mainContainer} >
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img
              className={styles.logo}
              src="/images/logo_notext.png"
              alt="CareCru Logo"
              width="80px"
            />
          </div>
          <div className={styles.header_text}>{formList[this.state.index].title}</div>
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

          {(this.state.formLength - 1 > this.state.index) && (this.state.index >= 1 || this.state.create) ?
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
                submit(formNames[this.state.index]);
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
