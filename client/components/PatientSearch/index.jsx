
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toArray from 'lodash/toArray';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Avatar, AutoCompleteForm } from '../library';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import { StyleExtender } from '../Utils/Themer';
import styles from './styles.scss';

const baseTheme = { suggestionsContainerOpen: styles.containerOpen };

function Suggestion(patient) {
  return (
    <div className={styles.suggestionContainer}>
      <Avatar user={patient} size="xs" />
      <div className={styles.suggestionContainer_details}>
        <div className={styles.suggestionContainer_fullName}>
          {`${patient.firstName} ${patient.lastName}${
            patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : ''
          }`}
        </div>
        <div className={styles.suggestionContainer_date}>
          Last Appointment:{' '}
          {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
        </div>
      </div>
    </div>
  );
}

class PatientSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
    };

    this.searchPatients = this.searchPatients.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onSuggestionSelected(event, { suggestion }) {
    this.props.onSelect(suggestion);
  }

  onInputChange(e) {
    this.setState({ value: e.target.value });
  }

  searchPatients(value) {
    // The reason we use fetchEntities is to populate the store with joined data
    // like chats and textMessages while we search
    return this.props
      .fetchEntitiesRequest({
        url: '/api/patients/search',
        params: { patients: value },
      })
      .then(({ patients }) => {
        // need to merge in chat information
        const suggestions = toArray(patients).map((patient) => {
          patient.chatId = patient.chats[0];
          return patient;
        });

        this.setState({ suggestions });
      });
  }

  render() {
    const { inputProps, theme, focusInputOnMount } = this.props;

    const { suggestions, value } = this.state;

    const finalInputProps = Object.assign({}, inputProps, {
      value: value || '',
      onChange: this.onInputChange,
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    });

    const newTheme = StyleExtender(theme, baseTheme);

    return (
      <AutoCompleteForm
        data-test-id={this.props['data-test-id']}
        suggestions={suggestions}
        getSuggestions={this.searchPatients}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={p => p.firstName}
        inputProps={finalInputProps}
        theme={newTheme}
        focusInputOnMount={focusInputOnMount}
        renderSuggestion={Suggestion}
      />
    );
  }
}

PatientSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  inputProps: PropTypes.objectOf(PropTypes.any),
  theme: PropTypes.objectOf(PropTypes.string),
  focusInputOnMount: PropTypes.bool,
  'data-test-id': PropTypes.string,
};

PatientSearch.defaultProps = {
  focusInputOnMount: true,
  inputProps: {},
  theme: {},
  'data-test-id': '',
};

const mapDispatchToProps = dispatch => bindActionCreators({ fetchEntitiesRequest }, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(PatientSearch);
