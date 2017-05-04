
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import PatientListItem from './PatientListItem';
import PatientData from './PatientData';
import {
  Button,
  Form,
  Field ,
  Tabs,
  Tab,
  Grid,
  Row,
  Col,
  ListItem,
  InfiniteScroll,
} from '../../library';
import styles from './main.scss';

// TODO: separate this component into:
// - PatientList
// - PatientDisplay
// - PatientEventLog
// - PatientSettings

class PatientList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const {
      filters,
      updateEditingPatientState,
      editingPatientState,
      changePatientInfo,
      form,
    } = this.props;
    const patientNameFilterText = filters && filters.values && filters.values.patients;

    const x = this.props.appointments.toArray().map((appointment) => {
      let patient = this.props.patients.get(appointment.patientId);
      patient.appointment = appointment;

      return patient;
    });

    // TODO: remove appointments with repeating patientIds

    let patientList = x.sort((a, b) => moment(a.appointment.startDate).diff(b.appointment.startDate));

    const array = [];
    patientList = patientList.filter((item, pos) => {
      const id = item.id;
      if (array.includes(id)) {
        return false;
      }
      array.push(id);
      return true;
    });

    return (
      <Grid>
        <Row className={styles.patients}>
          <Col xs={12} sm={4} md={4} lg={2}>
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
                  {patientList.map((user, i) => {
                    return <PatientListItem
                    key={user.appointment.id + i}
                    user={user}
                    initialLoad={false}
                    threshold={0}
                    currentPatient={this.props.currentPatient}
                    setCurrentPatient={this.props.setCurrentPatient}
                    />
                  })}
                </InfiniteScroll>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={8} lg={10}>
            <div className={styles.patients_content}>
              <Row>
                <Col xs={12}>
                  <div className={styles.patients_content__header}>
                    <div className={styles.patients_content__addUser}>
                      Add New Patient
                      <span>
                        <i className="fa fa-plus" />
                      </span>
                    </div>
                    <div className={styles.patient_profile}>
                      <div className={styles.patient_profile__photo}>
                        <img src="../img/patient-profile.png" alt="photo" />
                      </div>
                      <div className={`${styles.patient_profile__name} ${styles.personal__table}`}>
                        <i className="fa fa-user" />
                        <span>Claire Lacey, 6</span>
                      </div>
                      <div className={`${styles.patient_profile__info} ${styles.personal__table}`}>
                        <div className={styles.personal__birthday}>
                          <i className="fa fa-calendar" />
                          <span>05/22/2010</span>
                        </div>
                        <div className={styles.personal__age}>
                          <span>6 years</span>
                        </div>
                        <div className={styles.personal__gender}>
                          <span>Female</span>
                        </div>
                      </div>
                      <div className={`${styles.patient_profile__language} ${styles.personal__table}`}>
                        <i className="fa fa-phone" />
                        <span>123-456-7890</span>
                      </div>
                      <div className={`${styles.patient_profile__status} ${styles.personal__table}`}>
                        <i className="fa fa-flag" />
                        <span>claire123@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <div className={styles.patients_content__wrapper}>
                  <Col xs={4}>
                    <div className={styles.left}>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className={styles.middle}></div>
                  </Col>
                  <Col xs={4}>
                    <div className={styles.right}>
                      {/*<Tabs*/}
                        {/*index={0}*/}
                        {/*onChange={(index)=> this.handleTabChange(index, patientListFiltered)}>*/}
                        {/*<Tab label="Personal">*/}
                          {/*<PatientData*/}
                            {/*patient={patientListFiltered}*/}
                            {/*tabTitle="personal"*/}
                            {/*form={form}*/}
                            {/*changePatientInfo={changePatientInfo}*/}

                          {/*/>*/}
                        {/*</Tab>*/}
                        {/*<Tab label="Insurance">*/}
                          {/*<PatientData*/}
                            {/*patient={patientListFiltered}*/}
                            {/*tabTitle="insurance"*/}
                            {/*form={form}*/}
                            {/*changePatientInfo={changePatientInfo}*/}
                          {/*/>*/}
                        {/*</Tab>*/}
                      {/*</Tabs>*/}
                    </div>
                  </Col>
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
  setCurrentPatient: PropTypes.function
};

export default PatientList;
