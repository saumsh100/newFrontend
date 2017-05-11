
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import NewPatientForm from './NewPatientForm';
import EditPatientForm from './EditPatientForm';
import TextMessage from './TextMessage';
import UpcomingPatientsList from './UpcomingPatientsList';
import PatientInfoDisplay from './PatientInfoDisplay';
import {
  Button,
  Form,
  Field,
  Modal,
  Grid,
  Row,
  Tabs,
  Tab,
  Col,
  InfiniteScroll,
} from '../../library';
import styles from './main.scss';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthday: new Date(),
    };
  }

  render() {
    const patientsWithAppointments = this.props.appointments.toArray().map((appointment) => {
      const patient = this.props.patients.get(appointment.patientId);
      patient.appointment = appointment;

      return patient;
    });

    const patientList = uniqBy(patientsWithAppointments, 'id');

    const PatientInfo = (
      <PatientInfoDisplay
        currentPatient={this.props.currentPatient}
        onClick={this.props.newUserForm}
      />
    );

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.props.reinitializeState, component: Button },
      { label: 'Save', onClick: this.props.newPatient, component: RemoteSubmitButton, props: { form: formName }},
    ];

    return (
      <Grid>
        <Modal
          actions={actions}
          title="New Patient"
          type="small"
          active={this.props.active}
          onEscKeyDown={this.props.reinitializeState}
          onOverlayClick={this.props.reinitializeState}
        >
          <NewPatientForm
            onSubmit={this.props.newPatient}
            formName={formName}
            birthday={this.state.birthday}
            saveBirthday={this.saveBirthday}
          />
        </Modal>
        <Row className={styles.patients}>
          <Col xs={12} sm={4} md={4} lg={3}>
            <UpcomingPatientsList
              currentPatient={this.props.currentPatient}
              setCurrentPatient={this.props.setCurrentPatient}
              setSearchPatient={this.props.setSearchPatient}
              patientList={patientList}
              loadMore={this.props.loadMore}
              moreData={this.props.moreData}
              submitSearch={this.props.submitSearch}
              searchedPatients={this.props.searchedPatients}
              patients={this.props.patients}
            />
          </Col>
          <Col xs={12} sm={8} md={8} lg={9}>
            <div className={styles.patients_content}>
              <Row>
                <Col xs={12}>
                  {PatientInfo}
                </Col>
              </Row>
              <Row>
                <div className={styles.patients_content__wrapper}>
                  <Col xs={8}>
                    <TextMessage />
                  </Col>
                  <Col xs={4}>
                    <div className={styles.right}>
                      {(this.props.currentPatient ? (
                        <Tabs
                          index={0}
                        >
                          <Tab
                            label="Personal"
                            className={styles.tabs}
                          >
                            <EditPatientForm
                              onSubmit={this.props.editUser.bind(null, this.props.currentPatient)}
                              currentPatient={this.props.currentPatient}
                              formName={'editPatient'}
                              styles={styles}
                            />
                            <Button
                              className={styles.formButton}
                              onClick={this.props.deletePatient}
                            >
                              Delete Patient
                            </Button>
                          </Tab>
                        </Tabs>
                        ) : <div className={styles.loading}>Loading...</div>)}
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

MainContainer.propTypes = {
  patients: PropTypes.object.isRequired,
  setCurrentPatient: PropTypes.func,
  loadMore: PropTypes.func,
  currentPatient: PropTypes.object,
  moreData: PropTypes.bool,
  appointments: PropTypes.object.isRequired,
  active: PropTypes.bool,
  initialUser: PropTypes.bool,
  newUserForm: PropTypes.func,
  deletePatient: PropTypes.func,
  reinitializeState: PropTypes.func,
  editUser: PropTypes.func,
  newPatient: PropTypes.func,
  submitSearch: PropTypes.func,
};

export default MainContainer;
