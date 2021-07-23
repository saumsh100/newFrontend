import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { submit, destroy, reset } from 'redux-form';
import { connect } from 'react-redux';
import find from 'lodash/find';
import get from 'lodash/get';
import { bindActionCreators } from 'redux';
import ClinicDetails from './ClinicDetails';
import Address from './Address';
import AddUser from './AddUser';
import AddEnterprise from './AddEnterprise';
import EnterpriseList from './EnterpriseList';
import SelectAccountOptions from './SelectAccountOptions';
import Enterprise from '../../../../entities/models/Enterprise';
import { Button } from '../../../library';
import { setAllAccountInfo } from '../../../../thunks/admin';
import styles from './styles.scss';

const formNames = [
  'addEnterprise',
  'clinicDetails',
  'addressDetails',
  'addUser',
  'selectAccountOptions',
];

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
      isVisible: false,
    };
  }

  componentDidUpdate() {
    if (!this.props.active) {
      if (this.state.isVisible) {
        formNames.forEach((formName) => this.props.reset(formName) && this.props.destroy(formName));
        this.resetIndex();
      }
    } else if (!this.state.isVisible) {
      this.setVisible();
    }
  }

  get currentEnterprise() {
    const currentSelectedEnterprise = get(this.state, ['values', 0, 'id']);
    const newEnterprise = get(this.state, ['values', 0]);
    return currentSelectedEnterprise
      ? find(this.props.enterprises, ({ id }) => id === currentSelectedEnterprise)
      : newEnterprise;
  }

  get enterpriseLabelText() {
    return this?.currentEnterprise.id ? 'Selected Group: ' : 'Creating New Group: ';
  }

  setCreate() {
    this.setState((prevState) => ({
      create: !prevState.create,
      index: 0,
    }));
  }

  setCountry(country) {
    this.setState({
      country,
    });
  }

  setVisible() {
    this.setState({ isVisible: true });
  }

  resetIndex() {
    this.setState({
      index: 0,
      isVisible: false,
    });
  }

  previous() {
    const { index } = this.state;
    if (index === 1 || (!index && this.state.create)) {
      this.setState({
        index: 0,
        create: false,
        values: [],
      });
    } else {
      this.setState({
        index: index - 1,
      });
    }
  }

  next(values, index) {
    const newValues = this.state.values;
    newValues[index] = values;

    this.setState((prevState) => ({
      index: prevState.formLength - 1 > index ? index + 1 : prevState.index,
      values: newValues,
    }));

    if (index === this.state.formLength - 1) {
      this.props.setAllAccountInfo({ formData: newValues }).then((enterpriseId) => {
        formNames.forEach((formName) => this.props.reset(formName) && this.props.destroy(formName));
        this.props.selectEnterprise(enterpriseId);
      });
    }
  }

  render() {
    const { enterprises } = this.props;

    const component = this.state.create ? (
      AddEnterprise({
        onSubmit: this.next,
        index: 0,
        initialValues: this.state.values[0],
        formName: 'addEnterprise',
      })
    ) : (
      <EnterpriseList
        enterprises={enterprises}
        onSubmit={this.next}
        index={0}
        setCreate={this.setCreate}
      />
    );

    const formList = [
      {
        title: this.state.create ? 'Add New Group' : '',
        component,
      },
      {
        title: 'Practice Details',
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

    return (
      <div key={this.state.index} className={styles.mainContainer}>
        {this.currentEnterprise && (
          <div className={styles.enterpriseLabel}>
            {this.enterpriseLabelText} <span>{this.currentEnterprise.name}</span>
          </div>
        )}
        <div className={styles.header}>
          <div className={styles.header_text}>{formList[this.state.index].title}</div>
        </div>
        <div className={styles.formContainer}>{formList[this.state.index].component}</div>
        <div className={styles.buttonContainer}>
          {(this.state.index || this.state.create) && (
            <Button onClick={() => this.previous()} color="blue">
              Previous
            </Button>
          )}

          {this.state.formLength - 1 > this.state.index &&
            (this.state.index >= 1 || this.state.create) && (
              <Button
                onClick={() => {
                  this.props.submit(formNames[this.state.index]);
                }}
                className={styles.nextButton}
                color="blue"
              >
                Next
              </Button>
            )}
          {this.state.formLength - 1 === this.state.index && (
            <Button
              onClick={() => {
                this.props.submit(formNames[this.state.index]);
                this.props.setActive();
              }}
              className={styles.nextButton}
              color="blue"
            >
              Add New Practice
            </Button>
          )}
        </div>
      </div>
    );
  }
}

CreateAccount.propTypes = {
  submit: PropTypes.func.isRequired,
  setAllAccountInfo: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  enterprises: PropTypes.arrayOf(Enterprise).isRequired,
  selectEnterprise: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      submit,
      destroy,
      reset,
      setAllAccountInfo,
    },
    dispatch,
  );
}

const enhance = connect(null, mapActionsToProps);
export default enhance(CreateAccount);
