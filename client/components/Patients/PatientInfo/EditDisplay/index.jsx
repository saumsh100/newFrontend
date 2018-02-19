
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Card, Modal, Tabs, Tab, Button, Icon, DialogBox } from '../../../library';
import PersonalForm from './PersonalForm';
import AppointmentsForm from './AppointmentsForm/index';
import InsuranceForm from './InsuranceForm';
import FamilyForm from './FamilyForm';
import SettingsForm from './SettingsForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import styles from './styles.scss';

class EditDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      tabIndex: 0,
      country: '',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.outerTabIndex !== this.state.tabIndex) {
      this.setState({
        tabIndex: nextProps.outerTabIndex,
      });
    }
  }

  setCountry(value) {
    this.setState({
      country: value,
    });
  }

  handleTabChange(index) {
    this.setState({ tabIndex: index });
  }

  handleSubmit(values) {
    const {
      updateEntityRequest,
      patient,
      reinitializeState,
    } = this.props;

    if (values.mobilePhoneNumber === '') {
      values.mobilePhoneNumber = null;
    }

    values.isSyncedWithPms = false;
    values.address = {};
    values.address.zipCode = values.zipCode;
    values.address.country = values.country;
    values.address.city = values.city;
    values.address.street = values.street;
    values.address.state = values.state;

    values.preferences = {};
    values.preferences.newsletter = values.newsletter;
    values.preferences.birthdayMessage = values.birthdayMessage;
    values.preferences.reminders = values.reminders;

    const valuesMap = Map(values);
    const modifiedPatient = patient.merge(valuesMap);


    updateEntityRequest({
      key: 'patients',
      model: modifiedPatient,
      alert: {
        success: {
          body: `${patient.get('firstName')}'s Info Updated`,
        },
        error: {
          body: `${patient.get('firstName')}'s Info Not Updated`,
        },
      },
      url: `/api/patients/${patient.get('id')}`,
    }).then(() => {
      reinitializeState();
    });
  }

  render() {
    const {
      patient,
      reinitializeState,
      isOpen
    } = this.props;

    if (!patient) {
      return null;
    }

    const dropDownStyle = {
      toggleDiv: styles.toggleDivStyle,
    };

    const actions = [
      { label: 'Cancel',
        onClick: () => {
          reinitializeState();
        },
        component: Button,
        props: { border: 'blue' } ,
      },
      { label: 'Save',
        onClick: this.handleSubmit,
        component: RemoteSubmitButton,
        props: { color: 'blue', form: `Form${this.state.tabIndex + 1}`},
      },
    ];

    return (
      <div className={styles.mainContainer}>
        <DialogBox
          active={isOpen}
          onEscKeyDown={reinitializeState}
          onOverlayClick={reinitializeState}
          title={`Editing ${patient.get('firstName')}'s Patient Info`}
          actions={actions}
          custom
        >
          <div className={styles.editModal}>
            <div className={styles.content}>
              <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} noUnderLine >
                <Tab label="APPOINTMENTS" >
                  <AppointmentsForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                    dropDownStyle={dropDownStyle}
                  />
                </Tab>
                <Tab label="PERSONAL">
                  <PersonalForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                    setCountry={this.setCountry}
                    country={this.state.country}
                    dropDownStyle={dropDownStyle}
                  />
                </Tab>
                <Tab label="INSURANCE">
                  <InsuranceForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                    dropDownStyle={dropDownStyle}
                  />
                </Tab>
                <Tab label="FAMILY">
                  <FamilyForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                    dropDownStyle={dropDownStyle}
                  />
                </Tab>
                <Tab label="SETTINGS">
                  <SettingsForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </DialogBox>
      </div>
    );
  }
}

EditDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
}

export default EditDisplay;
