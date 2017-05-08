
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import PatientListItem from './PatientListItem';
import NewPatientForm from './NewPatientForm';
import EditPatientForm from './EditPatientForm';
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


// TODO: separate this component into:
// - PatientList
// - PatientDisplay
// - PatientEventLog
// - PatientSettings

class PatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthday: new Date(),
    };

    this.saveBirthday = this.saveBirthday.bind(this);
  }

  saveBirthday(value){
    this.setState({
      birthday: value,
    });
  }

  render() {

    const x = this.props.appointments.toArray().map((appointment) => {
      const patient = this.props.patients.get(appointment.patientId);
      patient.appointment = appointment;

      return patient;
    });

    const array = [];
    const patientList = x.filter((item, pos) => {
      const id = item.id;
      if (array.includes(id)) {
        return false;
      }
      array.push(id);
      return true;
    });

    const PatientInfo = (<PatientInfoDisplay
      currentPatient={this.props.currentPatient}
      onClick={this.props.newUserForm}
    />);

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.props.reinitializeState, component: Button },
      { label: 'Save', onClick: this.props.submit, component: RemoteSubmitButton, props: { form: formName }},
    ];

    return (
      <Grid>
        <Modal
          key={0}
          actions={actions}
          title="New Patient"
          type="small"
          active={this.props.active}
          onEscKeyDown={this.props.reinitializeState}
          onOverlayClick={this.props.reinitializeState}
        >
          <NewPatientForm
            onSubmit={this.props.submit}
            formName={formName}
            birthday={this.state.birthday}
            saveBirthday={this.saveBirthday}
          />
        </Modal>
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
                    <div className={styles.middle}/>
                  </Col>
                  <Col xs={4}>
                    <div className={styles.right}>
                      <Tabs
                        index={0}>
                        <Tab label="Info">
                          <EditPatientForm
                            onSubmit={this.props.submitEdit.bind(null, this.props.currentPatient)}
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
  submitEdit: PropTypes.func,
  submit: PropTypes.func,
};

export default PatientList;
