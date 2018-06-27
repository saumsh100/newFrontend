
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from '../../../library';
import DropdownSuggestion from '../../../library/DropdownSuggestion';
import { SortByFirstName } from '../../../library/util/SortEntities';
import DataSlot from '../../../library/DataSlot';
import styles from './styles.scss';

const patientList = (props, currentValue, scrollIndex, close, callback) => {
  const { userId } = props;

  return (
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
            {option.value === userId ? `${option.label} (Me)` : option.label}
          </span>
          <Link
            to={`../patient/edit/${option.value}`}
            className={styles.editPatient}
            tabIndex="-1"
          >
            EDIT
          </Link>
        </DataSlot>
      ))}
      <Link to="../patient/add" className={styles.addNewPatient}>
        Someone Else
      </Link>
    </div>
  );
};

export default function FamilyPatient(props) {
  const patients = props.familyPatients.sort(SortByFirstName).map(patient => ({
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
      renderValue={value =>
        patients.find(patient => patient.value === value).label
      }
      renderList={patientList}
      theme={{
        slotButton: styles.reviewAndBookSlot,
        wrapper: styles.reviewAndBookInputWrapper,
      }}
      userId={props.userId}
    />
  );
}

patientList.propTypes = {
  userId: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
};

FamilyPatient.propTypes = {
  familyPatients: PropTypes.arrayOf(PropTypes.shape({
    birthDate: PropTypes.string,
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    id: PropTypes.string,
    isEmailConfirmed: PropTypes.bool,
    isPhoneNumberConfirmed: PropTypes.bool,
    patientUserFamilyId: PropTypes.string,
    phoneNumber: PropTypes.string,
  })),
  onChange: PropTypes.func,
  value: PropTypes.string,
  userId: PropTypes.string,
};
