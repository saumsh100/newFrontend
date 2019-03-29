
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DialogBox } from '../../../library';
import NewPatientForm from './NewPatientForm';
import AssignPatientToChatDialog from '../../AssignPatientToChatDialog';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import SmartFilters from './SmartFilters';
import styles from '../styles.scss';

const initialState = {
  active: false,
  assignPatientToChatModalActive: false,
  patient: null,
};

class HeaderSection extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setActive = this.setActive.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setActive() {
    this.setState({ active: true });
  }

  openAssignPatientToChatModal(patient) {
    this.setState({
      patient,
      assignPatientToChatModalActive: true,
    });
  }

  reinitializeState() {
    this.setState(initialState);
  }

  handleSubmit(values) {
    this.props
      .createEntityRequest({
        key: 'patients',
        entityData: {
          ...values,
          isSyncedWithPms: false,
        },
        alert: {
          success: { body: 'New Patient Added.' },
          error: { body: 'Failed to add patient.' },
        },
      })
      .then(({ patients }) => {
        this.props.destroy('newUser');
        const [patient] = Object.values(patients);
        if (patient.foundChatId) {
          return this.openAssignPatientToChatModal(patient);
        }
        this.reinitializeState();
      });
  }

  render() {
    const formName = 'newPatientForm';
    const actions = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.handleSubmit,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: formName,
        },
      },
    ];

    return (
      <div className={styles.header}>
        <SmartFilters />
        <div className={styles.buttonContainer}>
          <Button onClick={this.setActive} color="blue" data-test-id="button_addNewPatient">
            Add New Patient
          </Button>
        </div>
        <DialogBox
          actions={actions}
          title="Add New Patient"
          type="medium"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <NewPatientForm onSubmit={this.handleSubmit} formName={formName} />
        </DialogBox>
        <AssignPatientToChatDialog
          callback={this.reinitializeState}
          active={this.state.assignPatientToChatModalActive}
          patient={this.state.patient}
        />
      </div>
    );
  }
}

HeaderSection.propTypes = {
  createEntityRequest: PropTypes.func.isRequired,
  destroy: PropTypes.func.isRequired,
};

export default HeaderSection;
