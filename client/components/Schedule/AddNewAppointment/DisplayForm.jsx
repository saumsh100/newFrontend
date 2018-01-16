
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
  Form,
  Field,
} from '../../library';
import AppointmentForm from './AppointmentForm';
import DisplaySearchedPatient from './DisplaySearchedPatient'
import { setTime } from '../../library/util/TimeOptions';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import styles from './styles.scss';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

const generateEntityOptions = (entities, label) => {
  const options = [];
  entities.sort(SortByName).map((entity) => {
    options.push({ label: entity[label], value: entity.id });
  });
  return options;
};

const generatePractitionerOptions = (practitioners) => {
  const options = [];
  practitioners.sort(SortByFirstName).map((pr) => {
    const label = pr.type === 'Dentist' ? `Dr. ${pr.lastName}` : `${pr.firstName} ${pr.lastName || ''}`;
    options.push({ label, value: pr.id });
  });
  return options;
};

class DisplayForm extends Component {
  constructor(props) {
    super(props);
    this.focusAutoSuggest = this.focusAutoSuggest.bind(this);
  }

  focusAutoSuggest() {
    this.autoSuggestInput.focus();
  }

  componentDidUpdate() {
    if (this.props.showInput) {
      this.focusAutoSuggest();
    }
  }

  render() {
    const {
      formName,
      patients,
      chairs,
      practitioners,
      selectedAppointment,
      unit,
      handleSubmit,
      handleDurationChange,
      handleUnitChange,
      handleAutoSuggest,
      getSuggestions,
      currentDate,
      patientSearched,
    } = this.props;

    let initialValues = {
      date: moment(currentDate),
    };

    let time = null;
    let startTime = null;
    let endTime = null;
    let patient = null;

    if (selectedAppointment) {
      const {
        startDate,
        endDate,
        customBufferTime,
        patientId,
        serviceId,
        chairId,
        practitionerId,
        note,
        isPatientConfirmed,
        isCancelled,
      } = selectedAppointment;

      patient = patients.get(patientId);
      const durationTime = getDuration(startDate, endDate, customBufferTime);

      startTime = setTime(startDate);
      time = setTime(startDate);
      endTime = setTime(endDate);
      const unitValue = unit ? Number((durationTime / unit).toFixed(2)) : 0;

      initialValues = {
        startTime,
        endTime,
        date: moment(startDate).format('L'),
        serviceId,
        practitionerId: practitionerId || '',
        chairId: chairId || '',
        isPatientConfirmed,
        isCancelled,
        duration: durationTime,
        unit: unitValue,
        note,
        patientSelected: patient.toJS(),
      };
    }

    const practitionerOptions = generatePractitionerOptions(practitioners);
    const chairOptions = generateEntityOptions(chairs, 'name');

    let patientDisplay = patientSearched;

    if (!this.props.showInput && patient) {
      patientDisplay = patient;
    }

    if (this.props.showInput && patient) {
      patientDisplay = null;
    }

    if (patientSearched === '') {
      patientDisplay = patientSearched;
    }

    const autoCompleteStyle = {
      error: styles.errorStyle,
      icon: styles.iconAuto,
      label: styles.labelAuto,
      input: styles.inputStyleAuto,
      toggleValueDiv: styles.dropDownValueStyle,
      bar: styles.searchDropDownBar,
      group: styles.groupAuto,
    };

    const addNewPatientComponent = () => {
      return (
        <div
          className={styles.addNewPatient}
          onClick={(e) => {
            e.stopPropagation();
            this.props.setCreatingPatient({ createPatientBool: true });
            this.props.setShowInput(true);
            this.props.setPatientSearched(null)
          }}
        >
          Add New Patient
        </div>
      );
    };

    const searchStyles = !patientDisplay ? styles.searchContainer : styles.hidden;

    return (
      <Form
        form={formName}
        onSubmit={handleSubmit}
        ignoreSaveButton
        initialValues={initialValues}
        data-test-id="createAppointmentForm"
      >
        <DisplaySearchedPatient
          patient={patientDisplay}
          setPatientSearched={this.props.setPatientSearched}
          setShowInput={this.props.setShowInput}
          focusAutoSuggest={this.focusAutoSuggest}
        />

        <div className={searchStyles}>
          <Field
            component="AutoComplete"
            name="patientSelected"
            placeholder="Add Patient"
            getSuggestions={getSuggestions}
            onChange={(e, newValue) => handleAutoSuggest(newValue)}

            classStyles={styles.searchInput}
            theme={autoCompleteStyle}
            suggestionsContainerComponent={addNewPatientComponent}
            icon="search"
            refCallBack={(el) => this.autoSuggestInput = el}
            required
            onBlurFunction={()=> this.props.setShowInput(false)}
          />
        </div>
        <AppointmentForm
          practitionerOptions={practitionerOptions}
          chairOptions={chairOptions}
          selectedAppointment={selectedAppointment}
          time={time}
          unit={unit}
          handleDurationChange={handleDurationChange}
          handleUnitChange={handleUnitChange}
          handleStartTimeChange={this.props.handleStartTimeChange}
          handleEndTimeChange={this.props.handleEndTimeChange}
        />
      </Form>
    );
  }

}

DisplayForm.PropTypes = {
  formName: PropTypes.string.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  practitioners: PropTypes.object.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleAutoSuggest: PropTypes.func.isRequired,
  handlePractitionerChange: PropTypes.func.isRequired,
};

export default DisplayForm;
