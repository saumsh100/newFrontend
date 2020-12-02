
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { Map } from 'immutable';
import { sortAsc, dateFormatter } from '@carecru/isomorphic';
import {
  Form,
  Field,
  generateTimeOptions,
  getTodaysDate,
  getUTCDate,
  DateTimeObj,
} from '../../library';
import AppointmentForm from './AppointmentForm';
import DisplaySearchedPatient from './DisplaySearchedPatient';
import { setTime, getDuration } from '../../library/util/TimeOptions';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import styles from './styles.scss';

const generateEntityOptions = (entities, label) =>
  entities.sort(SortByName).reduce(
    (prev, curr) => [
      ...prev,
      {
        label: curr[label],
        value: curr.id,
      },
    ],
    [],
  );

const generatePractitionerOptions = practitioners =>
  practitioners.sort(SortByFirstName).reduce(
    (prev, curr) => [
      ...prev,
      {
        label: curr.getPrettyName(),
        value: curr.id,
      },
    ],
    [],
  );

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
const defaultStartTime = (timezone, date) => {
  const now = getTodaysDate(timezone).add(60, 'minutes');
  const sortedTimes = generateTimeOptions({ timezone,
    date }).sort((a, b) =>
    sortAsc(a.value, b.value));
  const nextAvailable =
    sortedTimes.find(opt => dateFormatter(opt.value, timezone, 'HH:mm') > now.format('HH:mm')) ||
    sortedTimes[0];

  return nextAvailable.value;
};

class DisplayForm extends Component {
  constructor(props) {
    super(props);
    this.autoSuggest = createRef();
    this.focusAutoSuggest = this.focusAutoSuggest.bind(this);
  }

  componentDidUpdate() {
    if (this.props.showInput) {
      this.focusAutoSuggest();
    }
  }

  focusAutoSuggest() {
    if (this.autoSuggest.current && this.autoSuggest.current.inputComponent) {
      this.autoSuggest.current.inputComponent.focus();
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
      timezone,
    } = this.props;

    const initDuration = 60;
    const initStartTime = defaultStartTime(timezone, currentDate);
    const initEndTime = getUTCDate(initStartTime, timezone)
      .add(initDuration, 'minutes')
      .toISOString();
    const initUnit = getDuration(initStartTime, initEndTime, 0) / unit;
    let initialValues = {
      date: getUTCDate(currentDate, timezone),
      startTime: initStartTime,
      duration: initDuration,
      endTime: initEndTime,
      unit: initUnit,
    };

    let time = null;
    let startTime = null;
    let endTime = null;
    let patient = null;
    let date = currentDate;

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
      date = startDate;

      startTime = setTime(startDate);
      time = setTime(startDate);
      endTime = setTime(endDate);
      const unitValue = unit ? Number((durationTime / unit).toFixed(2)) : 0;

      initialValues = {
        startTime,
        endTime,
        date: getUTCDate(startDate, timezone).toISOString(),
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
            ref={this.autoSuggest}
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
          date={date}
          unit={unit}
          handleDurationChange={handleDurationChange}
          handleUnitChange={handleUnitChange}
          handleStartTimeChange={this.props.handleStartTimeChange}
          handleEndTimeChange={this.props.handleEndTimeChange}
          timezone={timezone}
        />
      </Form>
    );
  }
}

export default React.memo(DisplayForm);

DisplayForm.propTypes = {
  chairs: PropTypes.instanceOf(Map).isRequired,
  currentDate: PropTypes.instanceOf(DateTimeObj).isRequired,
  formName: PropTypes.string.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  handleAutoSuggest: PropTypes.func.isRequired,
  handleDurationChange: PropTypes.func.isRequired,
  handleEndTimeChange: PropTypes.func.isRequired,
  handleStartTimeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUnitChange: PropTypes.func.isRequired,
  patientSearched: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  patients: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  selectedAppointment: PropTypes.string,
  setCreatingPatient: PropTypes.func.isRequired,
  setPatientSearched: PropTypes.func.isRequired,
  setShowInput: PropTypes.func.isRequired,
  showInput: PropTypes.bool.isRequired,
  unit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  timezone: PropTypes.string.isRequired,
};

DisplayForm.defaultProps = {
  selectedAppointment: null,
  patientSearched: '',
};
