import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { week, capitalize } from '../../../../../util/isomorphic';
import { Button, Icon, Input, parseDate } from '../../../../library';
import DropdownSelect from '../../../../library/DropdownSelect';
import DayPicker from '../../../../library/DayPicker';
import PatientSearch from '../../../../PatientSearch';
import { SelectedPatient } from '../AddToWaitlist';
import MultiSelect from '../../../../library/ui-kit/MultiSelect';
import FormWarning from '../../../../library/Form/FormWarning';
import styles from './styles.scss';
import Selector from './Selector';
import {
  convertArrayOfOptionsInMap,
  generateWaitlistHoursOnlyTime,
  getDayPickers,
  getTimePickers,
  getTimeSlot,
  getAllTimeSlots,
  generateDaysOfWeek,
  getTimeOnly,
} from '../helpers';
import { practitionerShape } from '../../../../library/PropTypeShapes';

const reasons = [
  {
    value: 'hygiene',
    label: 'Hygiene',
  },
  {
    value: 'recall',
    label: 'Recall',
  },
  {
    value: 'restorative',
    label: 'Restorative',
  },
];

const initalWeek = week.all.reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: false,
  }),
  {},
);

const setInitialState = (
  {
    endDate = null,
    note = '',
    patient = null,
    patientUser = null,
    daysOfTheWeek = initalWeek,
    availableTimes = [],
    reasonText = '',
    duration = 6,
    practitioner = null,
  },
  defaultUnit,
) => ({
  duration,
  minutes: duration ? defaultUnit * duration : 0,
  endDate,
  note,
  patient,
  patientUser,
  daysOfTheWeek,
  availableTimes,
  reasonText,
  practitionerId: practitioner?.ccId || null,
});

const WaitlistForm = ({
  waitlist,
  goToWaitlistTable,
  timezone,
  handleSubmit,
  initialState,
  isNewWaitSpot,
  defaultUnit,
  practitioners,
}) => {
  const [formValues, setFormValues] = useState(setInitialState(initialState, defaultUnit));
  const [isPatientInWaitlist, setIsPatientInWaitlist] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const selectedPatient = formValues.patient || formValues.patientUser;
  const selectedDaysOfWeek = Object.entries(formValues.daysOfTheWeek)
    .filter(([, v]) => v)
    .map(([v]) => v);

  useEffect(() => {
    const isPatientMatched = waitlist.some(({ patient, patientId, patientUser }) => {
      const { firstName, lastName } = patientId ? patient : patientUser;
      return selectedPatient?.firstName === firstName && selectedPatient?.lastName === lastName;
    });
    setIsPatientInWaitlist(isPatientMatched);
  }, [waitlist, selectedPatient]);
  // TODO: use office hours instead of fixed time
  const timeOptions = useMemo(() => generateWaitlistHoursOnlyTime(timezone), [timezone]);

  useEffect(() => {
    let newSelectedTimes = [];
    if (formValues.availableTimes.length) {
      newSelectedTimes = formValues.availableTimes.map((time) => {
        if (time.length !== 4) {
          return getTimeOnly(time);
        }
        return time;
      });
    }
    setSelectedTimes(newSelectedTimes);
  }, [formValues.availableTimes]);

  const handleAutoSuggest = (newValue) => {
    setFormValues({
      ...formValues,
      patient:
        newValue && 'ccId' in newValue
          ? {
              avatarUrl: newValue.avatarUrl,
              firstName: newValue.firstName,
              id: newValue.ccId,
              lastName: newValue.lastName,
            }
          : null,
    });
  };

  const onChange = (key) => (v) => {
    setFormValues({
      ...formValues,
      [key]: v,
    });
  };

  const allWeekDays = useMemo(
    () =>
      week.all.map((day) => ({
        value: day,
        label: capitalize(day),
      })),
    [],
  );

  const handleDurationChange = (value) => {
    setFormValues({
      ...formValues,
      minutes: value * defaultUnit,
      duration: value,
    });
  };

  const handleMinutesChange = (value) => {
    setFormValues({
      ...formValues,
      minutes: value,
      duration: value / defaultUnit,
    });
  };

  const onDaysOfTheWeekChange = (values) => {
    onChange('daysOfTheWeek')(convertArrayOfOptionsInMap(values, generateDaysOfWeek()));
  };

  const handleDayOnChange = (v) => {
    const startOfDay = parseDate(new Date(), timezone)
      .startOf('day')
      .toISOString();

    if (v >= startOfDay) {
      onChange('endDate')(parseDate(v, timezone).toString());
    }
  };

  const onToggleDayPicker = (key) => {
    const allChecked = week[key].every((day) => selectedDaysOfWeek.includes(day));
    const newValue = selectedDaysOfWeek.filter((day) => !week[key].includes(day));
    if (allChecked) {
      onDaysOfTheWeekChange(newValue);
    } else {
      onDaysOfTheWeekChange([...newValue, ...week[key]]);
    }
  };

  const onToggleTimePicker = (data) => {
    const allChecked = data.every((time) => selectedTimes.includes(time));
    const newValue = selectedTimes.filter((time) => !data.includes(time));
    if (allChecked) {
      onChange('availableTimes')(newValue);
    } else {
      onChange('availableTimes')([...newValue, ...data]);
    }
  };

  const returnFormattedValues = (v) => {
    const result = timeOptions.find((option) => option.value === v)?.label;
    if (result) {
      return result;
    }
    return null;
  };

  const timeSlots = useMemo(() => {
    const options = timeOptions.map((option) => {
      option.slot = getTimeSlot(option.label);
      return option;
    });
    return getAllTimeSlots(options);
  }, [timeOptions]);

  const timePickers = getTimePickers(selectedTimes, timeSlots, onToggleTimePicker);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    delete formValues.minutes;
    handleSubmit(formValues);
  };

  return (
    <div className={styles.waitlistFormContainer}>
      <div>
        <div
          className={styles.redirect}
          onClick={goToWaitlistTable}
          role="button"
          tabIndex={0}
          onKeyUp={(e) => e.keyCode === 13 && goToWaitlistTable}
        >
          <div className={styles.iconWrapper}>
            <Icon size={1} icon="chevron-left" />
          </div>
          Cancel and return to waitlist
        </div>
      </div>
      {isNewWaitSpot && isPatientInWaitlist && (
        <div className={styles.alreadyInWaitlist}>
          <FormWarning
            onClose={() => {
              setIsPatientInWaitlist(false);
            }}
            message="This patient is already on the waitlist. Please review before adding to the waitlist."
          />
        </div>
      )}
      <div className={styles.heading}>{isNewWaitSpot ? 'Add to Waitlist' : 'Update Wait Spot'}</div>
      <form id="waitlist-form" onSubmit={handleSubmitForm} className={styles.waitlistFormWrapper}>
        <div className={styles.waitlistForm}>
          <div className={styles.waitlistFormColumnLeft}>
            {selectedPatient ? (
              <SelectedPatient
                avatarSize="xs"
                className={styles.patientContainer}
                handleAutoSuggest={handleAutoSuggest}
                patientSearched={selectedPatient}
              />
            ) : (
              <PatientSearch
                onSelect={handleAutoSuggest}
                theme={{
                  container: styles.patientSearchClass,
                  suggestionsContainerOpen: styles.containerOpen,
                }}
                inputProps={{
                  classStyles: styles.patientSearchInput,
                  placeholder: 'Add Patient *',
                }}
              />
            )}
            <MultiSelect
              onChange={onDaysOfTheWeekChange}
              options={allWeekDays}
              selected={selectedDaysOfWeek}
              defaultValue={selectedDaysOfWeek}
              theme={{ selectWrapper: styles.inputWrapper }}
              selector={(disabled, selectedItems, error, getToggleButtonProps, handleSelection) => (
                <Selector
                  disabled={disabled}
                  selected={selectedDaysOfWeek}
                  placeholder="Preferred Days"
                  error={error}
                  selectorProps={getToggleButtonProps()}
                  handleSelection={handleSelection}
                />
              )}
              extraPickers={getDayPickers(selectedDaysOfWeek, onToggleDayPicker)}
              shouldCheckUpdate
            />
            <div className={styles.unitFieldsWrapper}>
              <div className={styles.waitlistFormColumnLeft}>
                <DropdownSelect
                  onChange={onChange('reasonText')}
                  value={formValues.reasonText || ''}
                  theme={{ label: styles.label }}
                  label="Reason"
                  options={reasons}
                />
              </div>
              <div className={styles.waitlistFormColumnRight}>
                <DropdownSelect
                  onChange={onChange('practitionerId')}
                  value={formValues?.practitionerId || ''}
                  theme={{ label: styles.label }}
                  label="Preferred Practitioner"
                  options={practitioners}
                />
              </div>
            </div>
          </div>
          <div className={styles.waitlistFormColumnRight}>
            <DayPicker
              disabledDays={{ before: new Date() }}
              label="Remove from Waitlist (date)"
              onChange={handleDayOnChange}
              timezone={timezone}
              value={formValues.endDate || ''}
            />
            <MultiSelect
              onChange={onChange('availableTimes')}
              options={timeOptions}
              selected={selectedTimes}
              defaultValue={selectedTimes}
              theme={{ selectWrapper: styles.inputWrapper }}
              selector={(disabled, selectedItems, error, getToggleButtonProps, handleSelection) => (
                <Selector
                  disabled={disabled}
                  selected={selectedTimes}
                  placeholder="Preferred Times"
                  formatValue={returnFormattedValues}
                  error={error}
                  selectorProps={getToggleButtonProps()}
                  handleSelection={handleSelection}
                />
              )}
              extraPickers={timePickers}
              shouldCheckUpdate
            />
            <div className={styles.unitFieldsWrapper}>
              <div className={styles.waitlistFormColumnLeft}>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  label={`Unit (${defaultUnit})`}
                  step={1}
                  min={0}
                  onChange={({ target }) => handleDurationChange(target.value || null)}
                  value={formValues.duration || ''}
                />
              </div>
              <div className={styles.waitlistFormColumnRight}>
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  label="Duration"
                  step={1}
                  min={0}
                  onChange={({ target }) => handleMinutesChange(target.value)}
                  value={formValues.minutes || ''}
                />
              </div>
            </div>
          </div>
          <div className={styles.waitlistFormColumnFull}>
            <div htmlFor="textarea" className={styles.columnLabel}>
              Notes
            </div>
            <div className={styles.columnBody}>
              <textarea
                id="textarea"
                className={styles.textArea}
                onChange={({ target }) => onChange('note')(target.value)}
                value={formValues.note || ''}
              />
            </div>
          </div>
        </div>
      </form>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <Button onClick={goToWaitlistTable} border="blue">
            Cancel
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            color="blue"
            type="submit"
            form="waitlist-form"
            disabled={selectedPatient === null}
          >
            {isNewWaitSpot ? 'Add' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

WaitlistForm.propTypes = {
  goToWaitlistTable: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialState: PropTypes.objectOf(PropTypes.any),
  isNewWaitSpot: PropTypes.bool.isRequired,
  defaultUnit: PropTypes.number.isRequired,
  practitioners: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

WaitlistForm.defaultProps = {
  initialState: {},
};

export default WaitlistForm;
