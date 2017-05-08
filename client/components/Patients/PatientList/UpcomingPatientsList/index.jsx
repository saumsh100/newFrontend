import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../main.scss';
import PatientListItem from '../PatientListItem';
import {
  Field,
  InfiniteScroll,
  Form,
} from '../../../library';


class UpcomingPatientList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={styles.patients_list}>
        <div className={styles.patients_list_title}>Patients</div>
        <div className={`${styles.patients_list__search} ${styles.search}`}>
          <label className={styles.search__label} htmlFor="search__input">
            <i className="fa fa-search" />
          </label>
          <Form form="patientList" ignoreSaveButton>
            <Field className={styles.search__input}
                   type="text"
                   name="patients"
            />
          </Form>
          <div className={styles.search__edit}>
            <i className="fa fa-pencil" />
          </div>
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
};
export default UpcomingPatientList;
