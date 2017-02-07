import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import PatientListItem from './PatientListItem';
import PersonalData from './PersonalData';
import InsuranceData from './InsuranceData';
import { Button, Form, Field , Tabs, Tab } from '../../library';
import styles from './main.scss';


class PatientList extends Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleTabChange(index, patientListFiltered) {
    if (!(typeof index === "number")) return
    if (!patientListFiltered) return
    let title = "personal";
    switch (index) {
      case 0:
        title = "personal";
        break
      case 1: 
        title = "insurance";
        break;
    }
    const params = {
      id: patientListFiltered.id,
      activeTabIndex: index,
      isEditing: false,
      title,
    };
    this.props.updateEditingPatientState(params);
  }

  handleInput() {
    const value = this.textInput.value;
    this.props.setPatientsFilter(value)
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
    let patientList = this.props.patients.models.toArray()

    if (!!patientNameFilterText) {
      const pattern = new RegExp(patientNameFilterText, 'i');
      patientList = patientList.filter(d => pattern.test(d.name));
    }

    const patientListWithAppointments = patientList.filter((p) => (moment(p.lastAppointmentDate)._d
      .toString() !== "Invalid Date"))
      .sort((a, b) => (moment(a.toJS && a.toJS().lastAppointmentDate) > moment(b.toJS && b.toJS().lastAppointmentDate)));
    const patientListWithoutAppointments = patientList.filter((p) => (moment(p.lastAppointmentDate)._d
        .toString() === "Invalid Date"));
    const patientListSorted = patientListWithAppointments.concat(patientListWithoutAppointments);
    const patientListFiltered = patientListSorted
      .filter(n => (n.patientId === this.props.currentPatient))[0];
    const currentPatientState = patientListFiltered && editingPatientState[patientListFiltered.id];
    let activeTabIndex = null;
    if (currentPatientState) {
      activeTabIndex = currentPatientState.activeTabIndex;
    }
    return (
      <div className={styles.patients}>
        <div className={styles.patients_list}>
          <div className={`${styles.patients_list__search} ${styles.search}`}>
            <label className={styles.search__label} htmlFor="search__input">
              <i className="fa fa-search" />
            </label>
            <Form form="patientList">
              <Field className={styles.search__input}
                type="text"
                name="patients"
              />
            </Form>
            <div className={styles.search__edit}>
              <i className="fa fa-pencil" />
            </div>
          </div>
          <ul className={styles.patients_list__users}>
            {patientListSorted.map(user => {
              return (<PatientListItem
                key={user.patientId}
                user={user}
                currentPatient={this.props.currentPatient}
                setCurrentPatient={this.props.setCurrentPatient}
              />);
            })}
          </ul>
        </div>
        <div className={styles.patients_content}>
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
          <div className={styles.patients_content__wrapper}>
            <div className={styles.left}></div>
            <div className={styles.right}>
              <Tabs index={activeTabIndex || 0}
                onChange={(index)=> this.handleTabChange(index, patientListFiltered)}>
                <Tab label="Personal">
                  <PersonalData 
                    patient={patientListFiltered}
                    updateEditingPatientState={updateEditingPatientState}
                    tabTitle="personal"
                    currentPatientState={currentPatientState}
                    editingPatientState={editingPatientState}
                    form={form}
                    changePatientInfo={changePatientInfo}

                  />
                </Tab>
                <Tab label="Insurance">
                  <InsuranceData
                    patient={patientListFiltered}
                    updateEditingPatientState={updateEditingPatientState}
                    tabTitle="insurance"
                    currentPatientState={currentPatientState}
                    editingPatientState={editingPatientState}
                    form={form}
                    changePatientInfo={changePatientInfo}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
  setCurrentPatient: PropTypes.function
};

export default PatientList;
