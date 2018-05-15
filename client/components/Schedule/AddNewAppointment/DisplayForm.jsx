
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Map } from 'immutable';
import { Form, Field } from '../../library';
import AppointmentForm from './AppointmentForm';
import DisplaySearchedPatient from './DisplaySearchedPatient';
import { setTime, getDuration } from '../../library/util/TimeOptions';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import styles from './styles.scss';

const generateEntityOptions = (entities, label) =>
  entities
    .sort(SortByName)
    .reduce((prev, curr) => [...prev, { label: curr[label], value: curr.id }], []);

const buildPractitionerTitle = practitioner =>
  (practitioner.type === 'Dentist'
    ? `Dr. ${practitioner.lastName}`
    : `${practitioner.firstName} ${practitioner.lastName || ''}`);

const generatePractitionerOptions = practitioners =>
  practitioners
    .sort(SortByFirstName)
    .reduce((prev, curr) => [...prev, { label: buildPractitionerTitle(curr), value: curr.id }], []);

/**
 * Generate an array containing valid time-slots,
 * incrementing the provided amount.
 *
 * @param {string|null} timeInput
 * @param {number} unitIncrement
 */
const generateTimeOptions = (timeInput = null, unitIncrement = 30) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = unitIncrement;
  const increments = 60 / increment;

  if (timeInput) {
    const minutes = moment(timeInput).minute();
    const remainder = minutes % increment;
    const label = moment(timeInput).format('LT');
    if (remainder) {
      timeOptions.push({ value: timeInput, label });
    }
  }
  let i;
  for (i = 6; i < totalHours; i += 1) {
    let j;
    for (j = 0; j < increments; j += 1) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const value = time.toISOString();
      const label = time.format('LT');
      timeOptions.push({ value, label });
    }
  }

  for (i = 0; i < 6; i += 1) {
    let j;
    for (j = 0; j < increments; j += 1) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const value = time.toISOString();
      const label = time.format('LT');
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
const validatePatient = value =>
  (value && typeof value === 'object' && value.id ? undefined : 'You must select a valid patient');

/**
 * Sets the defaultStartTime using the next time after the currentHour + 1hour.
 */
const defaultStartTime = () => {
  const now = moment().add(60, 'minutes');
  const sortedTimes = generateTimeOptions().sort((a, b) => (a.value < b.value ? -1 : 1));
  const nextAvailable =
    sortedTimes.find(opt => moment(opt.value).format('HH:mm') > now.format('HH:mm')) ||
    sortedTimes[0];
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

    const initDuration = 60;
    const initStartTime = defaultStartTime();
    const initEndTime = moment(initStartTime)
      .add(initDuration, 'minutes')
      .toISOString();
    const initUnit = getDuration(initStartTime, initEndTime, 0) / unit;
    let initialValues = {
      date: moment(currentDate),
      startTime: initStartTime,
      duration: initDuration,
      endTime: initEndTime,
      unit: initUnit,
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
        <button
          className={styles.addNewPatient}
          onClick={(e) => {
            e.stopPropagation();
            this.props.setCreatingPatient({ createPatientBool: true });
            this.props.setShowInput(true);
            this.props.setPatientSearched(null);
          }}
        >
          Add New Patient
        </button>
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
            data-test-id="patientSelected"
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
export default DisplayForm;

DisplayForm.propTypes = {
  chairs: PropTypes.instanceOf(Map),
  currentDate: PropTypes.instanceOf(moment),
  formName: PropTypes.string.isRequired,
  getSuggestions: PropTypes.func,
  handleAutoSuggest: PropTypes.func,
  handleDurationChange: PropTypes.func,
  handleEndTimeChange: PropTypes.func,
  handleStartTimeChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleUnitChange: PropTypes.func,
  patientSearched: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  patients: PropTypes.instanceOf(Map),
  practitioners: PropTypes.instanceOf(Map),
  selectedAppointment: PropTypes.string,
  setCreatingPatient: PropTypes.func,
  setPatientSearched: PropTypes.func,
  setShowInput: PropTypes.func,
  showInput: PropTypes.bool,
  unit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
