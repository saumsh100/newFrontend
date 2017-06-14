
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import NewPatientForm from './NewPatientForm';
import EditPatientForm from './EditPatientForm';
import PreferencesPatientForm from './PreferencesPatientForm';
import ContactPatientForm from './ContactPatientForm';
import TextMessage from './TextMessage';
import UpcomingPatientsList from './UpcomingPatientsList';
import PatientInfoDisplay from './PatientInfoDisplay';
import {
  Button,
  Form,
  Field,
  DialogBox,
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
      index: 0,
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    this.setState({
      index,
    });
  }

  render() {

    const patientsWithAppointments = this.props.appointments.toArray()
      .reduce((res, appointment) => {
        const patient = this.props.patients.get(appointment.patientId) || null;
        if (patient) {
          patient.appointment = appointment;
          res.push(patient);
        }
        return res;
      }, []);


    const patientList = uniqBy(patientsWithAppointments, 'id');

    const PatientInfo = (
      <PatientInfoDisplay
        currentPatient={this.props.currentPatient}
        onClick={this.props.newUserForm}
        onDelete={this.props.deletePatient}
      />
    );

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.props.reinitializeState, component: Button },
      { label: 'Save', onClick: this.props.newPatient, component: RemoteSubmitButton, props: { form: formName }},
    ];

    // Just for Coming Soon stuff
    const style = {
      display: 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      height: 'calc(51vh - 110px)',
    };

    const style2 = {
      'maxWidth': '50%',
      'maxHeight': '50%',
    };

    return (
      <Grid>
        <DialogBox
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
        </DialogBox>
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
              <Row className={styles.rightCon}>
                <Col xs={12} className={styles.background}>
                  {PatientInfo}
                </Col>
              </Row>
              <Row className={styles.rightCon}>
                <div className={styles.patients_content__wrapper}>
                  <Col xs={7}>
                    <TextMessage />
                  </Col>
                  <Col xs={5}>
                    <div className={styles.right}>
                      {(this.props.currentPatient ? (
                        <Tabs
                          index={this.state.index}
                          onChange={(index) => this.handleTabChange(index)}
                          navClass={styles.nav}
                        >
                          <Tab
                            label="Personal"
                            className={styles.tabs}
                          >
                            <div className={styles.tabdivs}>
                              <EditPatientForm
                                onSubmit={this.props.editUser.bind(null, this.props.currentPatient)}
                                currentPatient={this.props.currentPatient}
                                formName={'editPatient'}
                                styles={styles}
                              />
                            </div>
                          </Tab>
                          <Tab
                            label="Contact"
                            className={styles.tabs}
                          >
                            <div className={styles.tabdivs}>
                              <ContactPatientForm
                                onSubmit={this.props.editUser.bind(null, this.props.currentPatient)}
                                currentPatient={this.props.currentPatient}
                                formName={'contactPatient'}
                                styles={styles}
                              />
                            </div>
                          </Tab>
                          <Tab
                            label="Insurance"
                            className={styles.tabs}
                          >
                            <div style={style}>Coming Soon</div>
                          </Tab>
                          <Tab
                            label="Preferences"
                            className={styles.tabs}
                          >
                            <div className={styles.tabdivs}>
                              <PreferencesPatientForm
                                onSubmit={this.props.editUser.bind(null, this.props.currentPatient)}
                                currentPatient={this.props.currentPatient}
                                formName={'preferencesPatient'}
                                styles={styles}
                              />
                            </div>
                          </Tab>
                          <Tab
                            label="Family"
                            className={styles.tabs}
                          >
                            <div style={style}>Coming Soon</div>
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
