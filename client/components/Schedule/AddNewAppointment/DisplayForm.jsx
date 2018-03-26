
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
  Form,
  Field,
} from '../../library';
import AppointmentForm from './AppointmentForm';
import DisplaySearchedPatient from './DisplaySearchedPatient';
import { setTime, getDuration } from '../../library/util/TimeOptions';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import styles from './styles.scss';

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

/**
 * Generate an array containing valid time-slots,
 * incrementing the provided amount.
 *
 * @param {string} timeInput
 * @param {string} unitIncrement
 */
const generateTimeOptions = (timeInput, unitIncrement = 30) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = unitIncrement;
  const increments = 60 / increment;

  if (timeInput) {
    const minutes = moment(timeInput).minute();
    const remainder = minutes % increment;
    const today = new Date();
    const label = (today.dst() && !moment(new Date()).isDST() ? moment(timeInput).subtract(1, 'hours').format('LT') : moment(timeInput).format('LT'));
    if (remainder) {
      timeOptions.push({ value: timeInput, label });
    }
  }
  let i;
  for (i = 6; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const today = new Date();
      const value = time.toISOString();
      const label = (today.dst() && !moment(new Date()).isDST() ? time.subtract(1, 'hours').format('LT') : time.format('LT'));
      timeOptions.push({ value, label });
    }
  }

  for (i = 0; i < 6; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const today = new Date();
      const value = time.toISOString();
      const label = (today.dst() && !moment(new Date()).isDST() ? time.subtract(1, 'hours').format('LT') : time.format('LT'));
      timeOptions.push({ value, label });
    }
  }

  return timeOptions;
};

/**
 * Check if the current patientSelected value
 * is a valid object containing an ID.
 *
 * @param {*} value
 */
const validatePatient = value => (value && typeof value === 'object' && value.id ? undefined : 'You must select a valid patient');

const defaultStartTime = () => {
  const now = moment().add(60, 'minutes');
  const nextAvailable = generateTimeOptions().find(opt => moment(opt.value).format('HH:mm') > now.format('HH:mm'));
  return nextAvailable.value;
};

class DisplayForm extends Component {
  constructor(props) {
    super(props);
    this.focusAutoSuggest = this.focusAutoSuggest.bind(this);
  }

  componentDidUpdate() {
    if (this.props.showInput) {
      this.focusAutoSuggest();
    }
  }

  focusAutoSuggest() {
    if (this.autoSuggest && this.autoSuggest.inputComponent) {
      this.autoSuggest.inputComponent.focus();
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
      startTime: defaultStartTime(),
      duration: 60,
      endTime: moment(defaultStartTime()).add(60, 'minutes').toISOString(),
      unit: 15,
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

    if (patientSearched && patient) {
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

    const addNewPatientComponent = ({ containerProps, children }) => (
      <div {...containerProps}>
        {children}
        <div
          className={styles.addNewPatient}
          onClick={(e) => {
            e.stopPropagation();
            this.props.setCreatingPatient({ createPatientBool: true });
            this.props.setShowInput(true);
            this.props.setPatientSearched(null);
          }}
        >
          Add New Patient
          </div>
      </div>
    );

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
            renderSuggestionsContainer={addNewPatientComponent}
            icon="search"
            ref={el => (this.autoSuggest = el)}
            validate={[validatePatient]}
            onBlurFunction={() => this.props.setShowInput(false)}
          />
        </div>
        <AppointmentForm
          practitionerOptions={practitionerOptions}
          chairOptions={chairOptions}
          selectedAppointment={selectedAppointment}
          time={time}
          unit={unit}
          timeOptions={generateTimeOptions()}
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
