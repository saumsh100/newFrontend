
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import PatientListItem from './PatientListItem';
import PatientInfoDisplay from './PatientInfoDisplay';
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

    const x = this.props.appointments.toArray().map((appointment) => {
      const patient = this.props.patients.get(appointment.patientId);
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

    const PatientInfo = (<PatientInfoDisplay
      currentPatient={this.props.currentPatient}
    />);

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
                    setCurrentPatient={this.props.setCurrentPatient.bind(null, user)}
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
                  {PatientInfo}
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
