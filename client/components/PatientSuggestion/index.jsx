
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Avatar, Highlighter } from '../library';
import { findChunksAtBeginningOfWords } from '../Utils';
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
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const age = patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : '';
  const patientString = `${fullName}${age}`;
  const inputSearch = inputValue.split(' ').filter(v => v !== '');

  return (
    <div
      key={patient.id}
      {...getItemProps({
        id: patient.id,
        item: patient,
      })}
      className={classNames({ [newTheme.highlightedIndex]: highlightedIndex === index })}
    >
      <div className={newTheme.suggestionContainer}>
        <Avatar user={patient} size="xs" />
        <div className={newTheme.suggestionContainer_details}>
          <div className={newTheme.suggestionContainer_fullName}>
            <Highlighter
              highlightClassName={newTheme.bold}
              searchWords={inputSearch}
              findChunks={findChunksAtBeginningOfWords}
              autoEscape
              textToHighlight={patientString}
            />
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

PatientSuggestion.defaultProps = {
  inputValue: '',
  highlightedIndex: -1,
  theme: {},
};

PatientSuggestion.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
    context: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  inputValue: PropTypes.string,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    suggestionsContainerOpen: PropTypes.string,
    suggestionsList: PropTypes.string,
  }),
};

export default PatientSuggestion;
