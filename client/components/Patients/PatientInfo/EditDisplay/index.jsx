
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Tabs, Tab, Button, DialogBox } from '../../../library';
import PersonalForm from './PersonalForm';
import AppointmentsForm from './AppointmentsForm/index';
import InsuranceForm from './InsuranceForm';
import FamilyForm from './FamilyForm';
import SettingsForm from './SettingsForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import { familyDataSelector } from '../../Shared/helpers';
import styles from './styles.scss';


const NoInfo = text => (
  <div className={styles.formContainer}>
    <div className={styles.disabledPage}>
      <div className={styles.disabledPage_text}>
        {text}
      </div>
    </div>
  </div>
);

const NoFamilyInfo = () => NoInfo('No Family Information');


class EditDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      tabIndex: 1,
      country: '',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps() {
    /* if (nextProps.outerTabIndex !== this.state.tabIndex) {
      this.setState({
        tabIndex: nextProps.outerTabIndex,
      });
    }*/
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
    const { patient, reinitializeState, isOpen, role, accountViewer, wasAllFetched } = this.props;

    if (!patient) {
      return null;
    }

    const { patientNode, family, familyLength } = familyDataSelector(accountViewer);
    
    const dropDownStyle = {
      wrapper: styles.inputGroup,
      toggleDiv: styles.toggleDivStyle,
    };

    const inputStyle = {
      input: styles.inputBarStyle,
      group: styles.inputGroup,
    };

    const actions = [
      { label: 'Cancel',
        onClick: () => {
          reinitializeState();
        },
        component: Button,
        props: { border: 'blue' },
      },
      { label: 'Save',
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
          title={`Editing ${patient.get('firstName')}'s Patient Info`}
          actions={actions}
          bodyStyles={styles.editModalBody}
          custom
        >
          {wasAllFetched ? (
            <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} noUnderLine>
              <Tab label="Appointments" tabCard>
                {role === 'SUPERADMIN' ? (
                  <AppointmentsForm
                    patient={patient}
                    handleSubmit={this.handleSubmit}
                    dropDownStyle={dropDownStyle}
                    inputStyle={inputStyle}
                  />
                ) : (
                  NoInfo('No Appointment Information')
                )}
              </Tab>
              <Tab label="Personal" tabCard>
                <PersonalForm
                  patient={patient}
                  handleSubmit={this.handleSubmit}
                  setCountry={this.setCountry}
                  country={this.state.country}
                  dropDownStyle={dropDownStyle}
                  inputStyle={inputStyle}
                />
              </Tab>
              <Tab label="Insurance" tabCard>
                <InsuranceForm
                  patient={patient}
                  handleSubmit={this.handleSubmit}
                  dropDownStyle={dropDownStyle}
                  inputStyle={inputStyle}
                />
              </Tab>
              <Tab label="Family" tabCard>
                {role === 'SUPERADMIN' ? (
                  <FamilyForm
                    family={family}
                    familyLength={familyLength}
                    patient={patient}
                    patientNode={patientNode}
                    handleSubmit={this.handleSubmit}
                  />
                ) : (
                  NoFamilyInfo()
                )}
              </Tab>
              <Tab label="Settings" tabCard>
                <SettingsForm patient={patient} handleSubmit={this.handleSubmit} />
              </Tab>
            </Tabs>
          ) : null}
        </DialogBox>
      </div>
    );
  }
}

EditDisplay.propTypes = {
  patient: PropTypes.instanceOf(Object).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  wasAllFetched: PropTypes.bool,
  reinitializeState: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  accountViewer: PropTypes.instanceOf(Object),
};

export default EditDisplay;
