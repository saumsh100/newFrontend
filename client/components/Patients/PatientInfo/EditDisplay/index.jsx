
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Card, Modal, Tabs, Tab, Button, Icon } from '../../../library';
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

    values.isSyncedWithPms = false;
    values.address = {};
    values.address.zipCode = values.zipCode;
    values.address.country = values.country;
    values.address.city = values.city;
    values.address.street = values.street;
    values.address.state = values.state;

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


    const remoteButtonProps = {
      onClick: reinitializeState,
      form: `Form${this.state.tabIndex + 1}`,
      color: 'blue'
    };

    const dropDownStyle = {
      toggleDiv: styles.toggleDivStyle
    };

    return (
      <div className={styles.mainContainer}>
        <Modal
          active={isOpen}
          onEscKeyDown={reinitializeState}
          onOverlayClick={reinitializeState}
          custom
        >
          <div className={styles.editModal}>
            <div className={styles.header}>
              {`Editing ${patient.get('firstName')}'s Patient Info`}
              <div
                className={styles.header_closeIcon}
                onClick={reinitializeState}
              >
                <Icon icon="times" />
              </div>
            </div>
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
            <div className={styles.remoteSubmit}>
              <div className={styles.remoteSubmit_buttonDelete}>
                <Button
                  border="blue"
                  onClick={() => reinitializeState()}
                >
                  Cancel
                </Button>
              </div>
              <RemoteSubmitButton
                {...remoteButtonProps}
                className={styles.remoteSubmit_button}
              >
                Save
              </RemoteSubmitButton>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

EditDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
}

export default EditDisplay;
