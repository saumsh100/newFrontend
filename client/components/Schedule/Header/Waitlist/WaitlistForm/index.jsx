
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { week, capitalize, setDateToTimezone } from '@carecru/isomorphic';
import moment from 'moment-timezone';
import { Button, Icon } from '../../../../library';
import DropdownSelect from '../../../../library/DropdownSelect';
import DayPicker from '../../../../library/DayPicker';
import PatientSearch from '../../../../PatientSearch';
import { SelectedPatient } from '../AddToWaitlist';
import MultiSelect from '../../../../library/ui-kit/MultiSelect';
import styles from './styles.scss';
import Selector from './Selector';
import { convertArrayOfDaysInMap, generateWaitlistHours } from '../helpers';

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

const getUnits = (start, end) => Array.from(Array(end), (_, index) => ({ value: start + index }));

const initalWeek = week.all.reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: false,
  }),
  {},
);

const setInitialState = ({
  endDate = null,
  note = '',
  patient = null,
  patientUser = null,
  daysOfTheWeek = initalWeek,
  availableTimes = [],
  reasonText = '',
  duration = 0,
}) => ({
  endDate,
  note,
  patient,
  patientUser,
  daysOfTheWeek,
  availableTimes,
  reasonText,
  duration,
});

const WaitlistForm = ({
  goToWaitlistTable,
  timezone,
  handleSubmit,
  initialState,
  isNewWaitSpot,
}) => {
  const [formValues, setFormValues] = useState(setInitialState(initialState));
  const selectedPatient = formValues.patient || formValues.patientUser;
  const selectedDaysOfWeek = Object.entries(formValues.daysOfTheWeek)
    .filter(([, v]) => v)
    .map(([v]) => v);

  const selectedTimes = formValues.availableTimes.map(v => moment(v).toString());

  const units = useMemo(() => getUnits(1, 20), []);

  const handleAutoSuggest = (newValue) => {
    setFormValues({
      ...formValues,
      patient:
        newValue && 'id' in newValue
          ? {
            avatarUrl: newValue.avatarUrl,
            firstName: newValue.firstName,
            id: newValue.id,
            lastName: newValue.lastName,
          }
          : null,
    });
  };

  const onChange = key => (v) => {
    setFormValues({
      ...formValues,
      [key]: v,
    });
  };

  const weekdays = useMemo(
    () =>
      week.all.map(day => ({
        value: day,
        label: capitalize(day),
      })),
    [],
  );

  const timeOptions = useMemo(() => generateWaitlistHours(timezone), [timezone]);

  const onDaysOfTheWeekChange = (values) => {
    onChange('daysOfTheWeek')(convertArrayOfDaysInMap(values));
  };

  const handleDayOnChange = (v) => {
    const startOfDay = setDateToTimezone(new Date(), timezone)
      .startOf('day')
      .toISOString();

    if (v >= startOfDay) {
      onChange('endDate')(setDateToTimezone(v, timezone).toString());
    }
  };

  return (
    <div className={styles.waitlistFormContainer}>
      <div>
        <div
          className={styles.redirect}
          onClick={goToWaitlistTable}
          role="button"
          tabIndex={0}
          onKeyUp={e => e.keyCode === 13 && goToWaitlistTable}
        >
          <div className={styles.iconWrapper}>
            <Icon size={1} icon="chevron-left" />
          </div>
          Cancel and return to waitlist
        </div>
      </div>
      <div className={styles.heading}>{isNewWaitSpot ? 'Add to Waitlist' : 'Update Wait Spot'}</div>
      <form
        id="waitlist-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formValues);
        }}
        className={styles.waitlistFormWrapper}
      >
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
              options={weekdays}
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
            />
            <DropdownSelect
              onChange={onChange('reasonText')}
              value={formValues.reasonText || ''}
              theme={{ label: styles.label }}
              label="Reason"
              options={reasons}
            />
          </div>
          <div className={styles.waitlistFormColumnRight}>
            <DayPicker
              disabledDays={{ before: new Date() }}
              label="Remove from Waitlist (date)"
              onChange={handleDayOnChange}
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
                  formatValue={v => moment(v).format('LT')}
                  error={error}
                  selectorProps={getToggleButtonProps()}
                  handleSelection={handleSelection}
                />
              )}
            />
            <DropdownSelect
              theme={{ label: styles.label }}
              label="Units"
              onChange={onChange('duration')}
              value={formValues.duration || ''}
              options={units}
            />
          </div>
          <div className={styles.waitlistFormColumnFull}>
            <label htmlFor="textarea" className={styles.columnLabel}>
              Notes
            </label>
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
};

WaitlistForm.defaultProps = {
  initialState: {},
};

export default WaitlistForm;
