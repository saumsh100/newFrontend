import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../main.scss';
import PatientListItem from '../PatientListItem';
import UserSearchList from './UserSearchList';
import {
  Field,
  InfiniteScroll,
  Form,
} from '../../../library';

class UpcomingPatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
    };

    this.submit = this.submit.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  submit(value) {
    this.setState({
      showSearch: true,
    });

    this.props.submitSearch(value);
  }

  resetState() {
    this.setState({
      showSearch: false,
    });
  }

  render() {

    return (
      <div className={styles.patients_list}>
        <div className={styles.patients_list_title}>Patients</div>
        <div className={`${styles.patients_list__search} ${styles.search}`}>
          <label className={styles.search__label} htmlFor="search__input">
            <i className="fa fa-search" />
          </label>
          <Form
            form="patientList"
            ignoreSaveButton
            onSubmit={this.submit}
          >
            <Field
              className={styles.search__input}
              type="text"
              name="patients"
              onBlur={this.resetState}
            />
          </Form>
          <div className={styles.search__edit}>
            <i className="fa fa-pencil" />
          </div>
        </div>
        <div className={styles.patients_list__users2}>
          {(this.state.showSearch ? (this.props.searchedPatients.map((userId, i) => {
            const user = this.props.patients.get(userId);
            return (
              <UserSearchList
                key={user.id + i}
                user={user}
                setSearchPatient={this.props.setSearchPatient.bind(null, userId)}
              />
            );
          })) : null)}
        </div>
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
