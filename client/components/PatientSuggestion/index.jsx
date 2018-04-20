
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Avatar } from '../library';
import { capitalizeFirstLetter } from '../Utils';
import { StyleExtender } from '../Utils/Themer';
import styles from './styles.scss';

const PatientSuggestion = ({
  patient,
  index,
  highlightedIndex,
  inputValue,
  getItemProps,
  theme,
}) => {
  const newTheme = StyleExtender(theme, styles);
  const firstName = patient.firstName.slice(inputValue.length, patient.firstName.length);
  const fullName = `${firstName} ${patient.lastName}`;
  const age = patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : '';
  return (
    <div
      key={patient.id}
      {...getItemProps({ id: patient.id, item: patient })}
      className={classNames({ [newTheme.highlightedIndex]: highlightedIndex === index })}
    >
      <div className={newTheme.suggestionContainer}>
        <Avatar user={patient} size="xs" />
        <div className={newTheme.suggestionContainer_details}>
          <div className={newTheme.suggestionContainer_fullName}>
            <span className={newTheme.bold}>{`${capitalizeFirstLetter(inputValue)}`}</span>
            {`${fullName}${age}`}
          </div>
          <div className={newTheme.suggestionContainer_date}>
            Last Appointment:{' '}
            {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
          </div>
        </div>
      </div>
    </div>
  );
};

PatientSuggestion.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
  }),
  index: PropTypes.number,
  inputValue: PropTypes.string,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.func,
  theme: PropTypes.shape({
    suggestionsContainerOpen: PropTypes.string,
    suggestionsList: PropTypes.string,
  }),
};

export default PatientSuggestion;
