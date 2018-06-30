
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Tabs, Tab, Button, DialogBox } from '../../../library';
import RecallModel from '../../../../entities/models/Recall';
import ReminderModel from '../../../../entities/models/Reminder';
import PersonalForm from './PersonalForm';
import AppointmentsForm from './AppointmentsForm/index';
import InsuranceForm from './InsuranceForm';
import FamilyForm from './FamilyForm';
import SettingsForm from './SettingsForm';
import PatientModel from '../../../../entities/models/Patient';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import { familyDataSelector } from '../../Shared/helpers';
import { isResponsive } from '../../../../util/hub';
import CollapsibleTab from '../CollapsibleTab';
import styles from './styles.scss';

const NoInfo = text => (
  <div className={styles.formContainer}>
    <div className={styles.disabledPage}>
      <div className={styles.disabledPage_text}>{text}</div>
    </div>
  </div>
);

const NoFamilyInfo = () => NoInfo('No Family Information');

class EditDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
      country: '',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get dropDownStyle() {
    return {
      wrapper: styles.inputGroup,
      toggleDiv: styles.toggleDivStyle,
    };
  }

  get inputStyle() {
    return {
      input: styles.inputBarStyle,
      group: styles.inputGroup,
    };
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
    const { updateEntityRequest, patient, reinitializeState } = this.props;

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

  renderAppointmentsForm() {
    const { patient, role } = this.props;

    return role === 'SUPERADMIN' ? (
      <AppointmentsForm
        patient={patient}
        handleSubmit={this.handleSubmit}
        dropDownStyle={this.dropDownStyle}
        inputStyle={this.inputStyle}
      />
    ) : (
      NoInfo('No Appointment Information')
    );
  }

  renderPersonalForm() {
    const { patient } = this.props;

    return (
      <PersonalForm
        patient={patient}
        handleSubmit={this.handleSubmit}
        setCountry={this.setCountry}
        country={this.state.country}
        dropDownStyle={this.dropDownStyle}
        inputStyle={this.inputStyle}
      />
    );
  }

  renderInsuranceForm() {
    const { patient } = this.props;

    return (
      <InsuranceForm
        patient={patient}
        handleSubmit={this.handleSubmit}
        dropDownStyle={this.dropDownStyle}
        inputStyle={this.inputStyle}
      />
    );
  }

  renderFamilyForm() {
    const { patient, role, accountViewer } = this.props;
    const { patientNode, family, familyLength } = familyDataSelector(accountViewer);

    return role === 'SUPERADMIN' ? (
      <FamilyForm
        family={family}
        familyLength={familyLength}
        patient={patient}
        patientNode={patientNode}
        handleSubmit={this.handleSubmit}
      />
    ) : (
      NoFamilyInfo()
    );
  }

  renderSettingsForm() {
    const { patient, reminders, recalls } = this.props;

    return (
      <SettingsForm
        patient={patient}
        handleSubmit={this.handleSubmit}
        reminders={reminders}
        recalls={recalls}
      />
    );
  }

  renderDesktop() {
    if (!this.props.wasAllFetched) {
      return null;
    }

    return (
      <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} noUnderLine>
        <Tab label="Appointments" tabCard>
          {this.renderAppointmentsForm()}
        </Tab>
        <Tab label="Personal" tabCard>
          {this.renderPersonalForm()}
        </Tab>
        <Tab label="Insurance" tabCard>
          {this.renderInsuranceForm()}
        </Tab>
        <Tab label="Family" tabCard>
          {this.renderFamilyForm()}
        </Tab>
        <Tab label="Settings" tabCard>
          {this.renderSettingsForm()}
        </Tab>
      </Tabs>
    );
  }

  renderResponsive() {
    if (!this.props.wasAllFetched) {
      return null;
    }

    return (
      <div>
        <CollapsibleTab title="Appointments">{this.renderAppointmentsForm()}</CollapsibleTab>
        <CollapsibleTab title="Personal">{this.renderPersonalForm()}</CollapsibleTab>
        <CollapsibleTab title="Insurance">{this.renderInsuranceForm()}</CollapsibleTab>
        <CollapsibleTab title="Family">{this.renderFamilyForm()}</CollapsibleTab>
        <CollapsibleTab title="Settings">{this.renderSettingsForm()}</CollapsibleTab>
      </div>
    );
  }

  render() {
    const { patient, reinitializeState, isOpen } = this.props;

    if (!patient) {
      return null;
    }

    const actions = [
      {
        label: 'Cancel',
        onClick: () => {
          reinitializeState();
        },
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.handleSubmit,
        component: RemoteSubmitButton,
        props: { color: 'blue', form: `Form${this.state.tabIndex + 1}` },
      },
    ];

    return (
      <div className={styles.mainContainer}>
        <DialogBox
          active={isOpen}
          onEscKeyDown={reinitializeState}
          onOverlayClick={reinitializeState}
          title={
            !isResponsive()
              ? `Editing ${patient.get('firstName')}'s Patient Info`
              : `Editing ${patient.get('firstName')}'s Info`
          }
          actions={!isResponsive() ? actions : []}
          bodyStyles={styles.editModalBody}
          custom
        >
          {!isResponsive() ? this.renderDesktop() : this.renderResponsive()}
        </DialogBox>
      </div>
    );
  }
}

EditDisplay.propTypes = {
  accountViewer: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool,
  patient: PropTypes.instanceOf(PatientModel),
  recalls: PropTypes.objectOf(ReminderModel).isRequired,
  reinitializeState: PropTypes.func.isRequired,
  reminders: PropTypes.objectOf(RecallModel).isRequired,
  role: PropTypes.string.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  wasAllFetched: PropTypes.bool,
};

EditDisplay.defaultProps = {
  patient: null,
  wasAllFetched: false,
  isOpen: false,
  accountViewer: null,
};

export default EditDisplay;
