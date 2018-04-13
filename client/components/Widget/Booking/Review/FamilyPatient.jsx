
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from '../../../library';
import DropdownSuggestion from '../../../library/DropdownSuggestion';
import DataSlot from '../../../library/DataSlot';
import styles from './styles.scss';

const patientList = (props, currentValue, scrollIndex, close, callback) => (
  <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
    {props.options.map((option, i) => (
      <DataSlot
        key={i}
        {...props}
        selected={currentValue === option.value}
        option={option}
        theme={{ slotButton: styles.slotButton }}
      >
        <span
          className={styles.labelPatient}
          onClick={(e) => {
            e.preventDefault();
            props.onChange(option.value);
            scrollIndex = i;
            close();
          }}
        >
          {option.label}
        </span>
        <Link to={`../patient/edit/${option.value}`} className={styles.editPatient} tabIndex="-1">
          EDIT
        </Link>
      </DataSlot>
    ))}
    <Link to="../patient/add" className={styles.addNewPatient}>
      Add new Patient
    </Link>
  </div>
);

export default function FamilyPatient(props) {
  const patients = props.familyPatients
    .sort((previous, actual) => {
      const previousName = previous.firstName.toUpperCase();
      const actualName = actual.firstName.toUpperCase();
      let res = 0;
      if (previousName < actualName) {
        res = -1;
      } else if (previousName > actualName) {
        res = 1;
      }
      return res;
    })
    .map(patient => ({
      value: patient.id,
      label: `${patient.firstName} ${patient.lastName}`,
    }));
  return (
    <DropdownSuggestion
      required
      options={patients}
      data-test-id="text"
      name="patientWidgetId"
      value={props.value}
      onChange={props.onChange}
      renderValue={value => patients.find(patient => patient.value === value).label}
      renderList={patientList}
      theme={{
        slotButton: styles.reviewAndBookSlot,
        wrapper: styles.reviewAndBookInputWrapper,
      }}
    />
  );
}

FamilyPatient.propTypes = {
  familyPatients: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
