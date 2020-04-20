
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { week, capitalize, dateFormatter } from '@carecru/isomorphic';
import { Button, Icon } from '../../../../library';
import DropdownSelect from '../../../../library/DropdownSelect';
import DayPicker from '../../../../library/DayPicker';
import PatientSearch from '../../../../PatientSearch';
import { SelectedPatient } from '../AddToWaitlist';
import MultiSelect from '../../../../library/ui-kit/MultiSelect';
import styles from './styles.scss';
import Selector from './Selector';
import { generateWaitlistHours } from '../helpers';

const maxLength = max => value =>
  (value && value.length > max
    ? `Must be ${max} characters or less, and no blank spaces`
    : undefined);

const maxDateLength = maxLength(8);

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

const units = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
];

const WaitlistForm = ({ goToWaitlistTable, timezone, handleSubmit }) => {
  const [formValues, setFormValues] = useState({
    endDate: '',
    note: '',
    patient: null,
    daysOfTheWeek: [],
    availableTimes: [],
    reasonText: '',
    duration: '',
  });

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
      <div className={styles.heading}>Add to Waitlist</div>
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
            {formValues.patient ? (
              <SelectedPatient
                avatarSize="xs"
                className={styles.patientContainer}
                handleAutoSuggest={handleAutoSuggest}
                patientSearched={formValues.patient}
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
              onChange={onChange('daysOfTheWeek')}
              options={weekdays}
              selected={formValues.daysOfTheWeek}
              theme={{ selectWrapper: styles.inputWrapper }}
              selector={(disabled, selectedItems, error, getToggleButtonProps, handleSelection) => (
                <Selector
                  disabled={disabled}
                  selected={formValues.daysOfTheWeek}
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
              label="Date (MM/DD/YYYY)"
              validate={[maxDateLength]}
              onChange={onChange('endDate')}
              value={formValues.endDate || ''}
            />
            <MultiSelect
              onChange={onChange('availableTimes')}
              options={timeOptions}
              selected={formValues.availableTimes}
              theme={{ selectWrapper: styles.inputWrapper }}
              selector={(disabled, selectedItems, error, getToggleButtonProps, handleSelection) => (
                <Selector
                  disabled={disabled}
                  selected={formValues.availableTimes}
                  placeholder="Preferred Times"
                  formatValue={v => dateFormatter(v, timezone, 'LT')}
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
            disabled={formValues.patient === null}
          >
            Add
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
};

WaitlistForm.defaultProps = {};

export default WaitlistForm;
