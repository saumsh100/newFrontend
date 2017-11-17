
import React, { Component, PropTypes } from 'react';
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
    };

    this.setModal = this.setModal.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setModal() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  reinitializeState() {
    this.setState({
      isOpen: false,
    });
  }

  handleTabChange(index) {
    this.setState({ tabIndex: index });
  }

  handleSubmit(values) {
    const {
      updateEntityRequest,
      patient
    } = this.props;

    values.isSyncedWithPms = false;
    values.address = {};
    values.address.zipCode = values.zipCode;
    values.address.country = values.country;
    values.address.city = values.city;
    values.address.street = values.street;
    values.address.state = values.state;

    console.log(values)
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
      this.reinitializeState();
    });
  }

  render() {
    const {
      patient,
    } = this.props;


    const remoteButtonProps = {
      onClick: this.reinitializeState,
      form: `Form${this.state.tabIndex + 1}`,
    };

    return (
      <div className={styles.mainContainer}>
        <div className={styles.text}>
          <div className={styles.text_title}>
            Patient Info
          </div>
          <div className={styles.text_edit} onClick={() => this.setModal()}>
            <Icon icon="pencil" className={styles.text_icon} />
            Edit
          </div>
        </div>
        <Modal
          active={this.state.isOpen}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          custom
        >
          <div className={styles.editModal}>
            <div className={styles.header}>
              {`Editing ${patient.get('firstName')}'s Patient Info`}
              <div
                className={styles.header_closeIcon}
                onClick={this.reinitializeState}
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
                  />
                </Tab>
                <Tab label="PERSONAL">
                  <PersonalForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                  />
                </Tab>
                <Tab label="INSURANCE">
                  <InsuranceForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                  />
                </Tab>
                <Tab label="FAMILY">
                  <FamilyForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
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
                  color="darkgrey"
                  onClick={() => this.reinitializeState()}
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

export default EditDisplay;
