
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Avatar, AutoCompleteForm, getUTCDate, getTodaysDate } from '../library';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import { StyleExtender } from '../Utils/Themer';
import FetchPatients from '../GraphQLPatientSearch/fetchPatients';
import composeSearchQuery from '../GraphQLPatientSearch/composeSearchQuery';
import styles from './styles.scss';

const baseTheme = { suggestionsContainerOpen: styles.containerOpen };

function SuggestionBox(patient, timezone) {
  return (
    <div className={styles.suggestionContainer}>
      <Avatar user={patient} size="xs" />
      <div className={styles.suggestionContainer_details}>
        <div className={styles.suggestionContainer_fullName}>
          {`${patient.firstName} ${patient.lastName}${
            patient.birthDate ? `, ${getTodaysDate(timezone).diff(patient.birthDate, 'years')}` : ''
          }`}
        </div>
        <div className={styles.suggestionContainer_date}>
          Last Appointment:{' '}
          {patient.lastApptDate
            ? getUTCDate(patient.lastApptDate, timezone).format('MMM D YYYY')
            : 'n/a'}
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

  async searchPatients(value, fetchPatients) {
    const { data } = await fetchPatients({ search: value });
    const suggestions = data.accountViewer.patients.edges.map(v => v.node);
    this.setState({ suggestions });
  }

  render() {
    const { inputProps, theme, focusInputOnMount, timezone } = this.props;
    const { suggestions, value } = this.state;

    const finalInputProps = Object.assign({}, inputProps, {
      value: value || '',
      onChange: this.onInputChange,
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    });

    const newTheme = StyleExtender(theme, baseTheme);
    const setSearchData = refetch => data => refetch(composeSearchQuery(data));
    const suggestion = patient => SuggestionBox(patient, timezone);

    return (
      <FetchPatients>
        {({ refetch }) => (
          <AutoCompleteForm
            data-test-id={this.props['data-test-id']}
            suggestions={suggestions}
            getSuggestions={val => this.searchPatients(val, setSearchData(refetch))}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={p => p.firstName}
            inputProps={finalInputProps}
            theme={newTheme}
            focusInputOnMount={focusInputOnMount}
            renderSuggestion={suggestion}
          />
        )}
      </FetchPatients>
    );
  }
}

PatientSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
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

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchEntitiesRequest }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientSearch);
