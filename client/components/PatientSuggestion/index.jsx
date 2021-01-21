
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Avatar, getFormattedDate, getTodaysDate, Highlighter } from '../library';
import { findChunksAtBeginningOfWords } from '../Utils';
import { StyleExtender } from '../Utils/Themer';
import styles from './styles.scss';
import { patientShape } from '../library/PropTypeShapes';

const PatientSuggestion = ({
  patient,
  index,
  highlightedIndex,
  inputValue,
  getItemProps,
  theme,
  timezone,
}) => {
  const newTheme = StyleExtender(theme, styles);
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const age = patient.birthDate
    ? `, ${getTodaysDate(timezone).diff(patient.birthDate, 'years')}`
    : '';
  const patientString = `${fullName}${age}`;
  const inputSearch = inputValue.split(' ').filter(v => v !== '');

  return (
    <div
    key={patient.id}
    {...getItemProps}
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
            {patient.lastApptDate
              ? getFormattedDate(patient.lastApptDate, 'MMM D YYYY', timezone)
              : 'n/a'}
          </div>
        </div>
      </div>
    </div>
  );
};

PatientSuggestion.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  index: PropTypes.number.isRequired,
  inputValue: PropTypes.string,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    suggestionsContainerOpen: PropTypes.string,
    suggestionsList: PropTypes.string,
  }),
  timezone: PropTypes.string.isRequired,
};

PatientSuggestion.defaultProps = {
  inputValue: '',
  highlightedIndex: -1,
  theme: {},
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(PatientSuggestion);
