import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../main.scss';
import PatientListItem from '../PatientListItem';
import UserSearchList from './UserSearchList';
import {
  AutoCompleteForm,
  InfiniteScroll,
  Row,
} from '../../../library';

class UpcomingPatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      value: '',
      searched: [],
      results: [],
    };

    this.submit = this.submit.bind(this);
    this.resetState = this.resetState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  submit(event) {
    if (event.key === 'Enter') {
      let id = null;
      this.state.results.forEach((result) => {
        if (result.name === this.state.value) {
          id = result.id;
        }
      });

      if (id) {
        this.props.setSearchPatient(id);
      }
    }
  }

  getSuggestions(value) {
    return this.props.submitSearch({
      patients: value,
    }).then(() => {
      const inputValue = new RegExp(value, 'i');
      const inputLength = inputValue.length;
      const searched = this.props.searchedPatients.map((userId) => {
        return {
          id: this.props.patients.get(userId).get('id'),
          name: `${this.props.patients.get(userId).get('firstName')} ${this.props.patients.get(userId).get('lastName')}`,
          email: this.props.patients.get(userId).get('email'),
        };
      });

      const results = inputLength === 0 ? [] : searched.filter((person) => {
        return inputValue.test(person.name) || inputValue.test(person.email);
      });

      this.setState({
        results,
        searched,
      });

      return results;
    });

  };

  resetState() {
    this.setState({
      showSearch: false,
    });
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const inputProps = {
      placeholder: 'Patient Search',
      value: this.state.value,
      onChange: this.onChange,
      onKeyDown: this.submit,
      name: 'patients',
    };

    return (
      <div className={styles.patients_list}>
        <Row>
          <div className={styles.patients_list_title}>Patients</div>
          <div className={`${styles.patients_list__search} ${styles.search}`}>
            <label className={styles.search__label} htmlFor="search__input">
              <i className="fa fa-search" />
            </label>
            <AutoCompleteForm
              value={this.state.value}
              getSuggestions={this.getSuggestions}
              inputProps={inputProps}
            />
            <div className={styles.search__edit}>
              <i className="fa fa-pencil" />
            </div>
          </div>
        </Row>
        <Row>
          <div className={styles.patients_list__users}>
            <InfiniteScroll
              loadMore={this.props.loadMore}
              loader={<div style={{ clear: 'both' }}>Loading...</div>}
              hasMore={this.props.moreData}
              initialLoad={false}
              useWindow={false}
              threshold={50}
            >
              {this.props.patientList.map((user, i) => {
                return (
                  <PatientListItem
                    key={user.appointment.id + i}
                    user={user}
                    currentPatient={this.props.currentPatient}
                    setCurrentPatient={this.props.setCurrentPatient.bind(null, user)}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        </Row>
      </div>
    );
  }
}

UpcomingPatientList.propTypes = {
  patientList: PropTypes.object,
  setCurrentPatient: PropTypes.func,
  loadMore: PropTypes.func,
  currentPatient: PropTypes.object,
  moreData: PropTypes.bool,
  submitSearch: PropTypes.func,
  setSearchPatient: PropTypes.func,
};
export default UpcomingPatientList;
