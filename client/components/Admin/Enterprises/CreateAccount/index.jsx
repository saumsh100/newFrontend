
import React, { Component, PropTypes } from 'react';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import ContactDetails from './ContactDetails';
import AddUser from './AddUser';
import AddEnterprise from './AddEnterprise';
import { Button, ListBullets } from '../../../library';
import { setAllAccountInfo } from '../../../../thunks/admin';
import styles from './styles.scss';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.setIndex = this.setIndex.bind(this);

    this.state = {
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

  previous(index) {
    this.setState({
      index: index - 1,
    });
  }

  setIndex(index) {
    this.setState({
      index,
    });
  }

  render() {
    const {
      submit,
    } = this.props;

    const formNames = ['addEnterprise', 'clinicDetails', 'contactDetails', 'addUser'];

    const formList = [
      {
        title: 'Add Enterprise',
        component: AddEnterprise({
          onSubmit: this.next,
          index: 0,
          initialValues: this.state.values[0],
          formName: formNames[0],
          theme: 'primaryGrey',
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
        title: 'Contact Details',
        component: ContactDetails({
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

    return (
      <div key={this.state.index} className={styles.mainContainer}>
        <div className={styles.header}>{formList[this.state.index].title}</div>
        <div className={styles.formContainer}>
          {formList[this.state.index].component}
        </div>
        <div className={styles.buttonContainer}>
          {this.state.index ? (
            <Button
              onClick={() => this.previous(this.state.index)}
              icon="arrow-left"
            >
              Previous
            </Button>) : null }
          {this.state.formLength - 1 > this.state.index ?
            (<Button
              onClick={() => {
                submit(formNames[this.state.index]);
              }}
              className={styles.nextButton}
              icon="arrow-right"
            >
              Next
            </Button>)
          : (
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
            )}
        </div>
        <div className={styles.bulletContainer}>
          <div className={styles.bulletContainer_bullets}>
            <ListBullets
              index={this.state.index}
              length={this.state.formLength}
              setIndex={this.setIndex}
            />
          </div>
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
