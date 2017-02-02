import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';

class PersonalData extends Component {
  constructor(props) {
    super(props);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }
  handleClickEdit() {
    const params = {
      id: this.props.patient.id,
      isEditing: true,
      title: this.props.tabTitle,
    };
    this.props.updateEditingPatientState(params);
    console.log('double click handled');
  }

  handleClickSave(e) {
    console.log('save data handled');
    e.preventDefault();
  }

  renderEditingForm(patient) {
    const dialogId = `personal-${patient.id}`;
    const { name, birthday, language, gender } = patient;
    const fullName = patient.name.split(" ");
    const firstName = fullName[0];
    const lastName = fullName[1];
    const initialValues = {
      firstName,
      lastName,
      language,
      gender,
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.edit_personal}>
          <Form form={dialogId}
            initialValues={initialValues}
            onChange={() => { console.log("Changed!!!!") } }
          >
            <Field
              className={styles.edit_personal__name_first}
              type="text"
              name="firstName"
              placeholder="First name"
              onChange={() => { console.log("changed!!!") }}
            />

            <Field
              className={styles.edit_personal__name_m}
              type="text"
              name="middleName"
              placeholder="M"
            />

            <Field
              className={styles.edit_personal__name_last}
              type="text"
              name="lastName"
              placeholder="Last name"
            />
          </Form>

          <form>
            <div className={`${styles.edit_personal__name} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-user" />
              </div>
              <div className={styles.edit_personal__name_wrapper}>
                <input className={styles.edit_personal__name_first} type="text" placeholder="First" />
                <input className={styles.edit_personal__name_m} type="text" placeholder="M" />
                <input className={styles.edit_personal__name_last} type="text" placeholder="Last" />
              </div>
            </div>
            <div className={`${styles.edit_personal__info} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__info_header}>
                <div className={styles.edit_personal__icon}>
                  <i className="fa fa-calendar" />
                </div>
                <input className={styles.edit_personal__birthday} type="date" placeholder="Birthday" />
                <input className={styles.edit_personal__age} type="text" placeholder="Age" />
              </div>
              <div className={styles.edit_personal__gender}>
                <select>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div className={`${styles.edit_personal__language} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-comments" />
              </div>
              <select>
                <option>Eng</option>
                <option>Ukr</option>
              </select>
            </div>
            <div className={`${styles.edit_personal__status} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-flag" />
              </div>
              <select>
                <option>Active</option>
                <option>Passive</option>
              </select>
            </div>
            <input onClick={this.handleClickSave} className={styles.edit_personal__btn} type="submit" value="Save" />
          </form>
        </div>
      </div>
    );
  }

  renderPersonalInfo(patient) {
    const { birthday, gender, name } = patient;
    const showBirthday = moment(birthday).subtract(10, 'days').calendar();
    const age = moment().diff(patient.birthday, 'years')
    const birthdayAgeText = `${showBirthday}  ${age}`;
    return (
      <div onDoubleClick={this.handleClickEdit} className={styles.right__personal}>
        <div className={styles.personal}>
          <div className={`${styles.personal__name} ${styles.personal__table}`}>
            {console.log('curent - user', patient)}
            <div className={styles.personal__icon}>
              <i className="fa fa-user" />
            </div>
            <div className={styles.personal__value}>{patient.name}</div>
          </div>
          <div className={`${styles.personal__info} ${styles.personal__table}`}>
            <div className={styles.personal__birthday}>
              <div className={styles.personal__icon}>
                <i className="fa fa-calendar" />
              </div>
              <div className={styles.personal__value}>{patient.age}</div>
            </div>
            <div className={styles.personal__age}>
              <div className={styles.personal__value}>
                {birthdayAgeText}
              </div>
            </div>
            <div className={styles.personal__gender}>
              <div className={styles.personal__value}>{patient.gender}</div>
            </div>
          </div>
          <div className={`${styles.personal__language} ${styles.personal__table}`}>
            <div className={styles.personal__icon}>
              <i className="fa fa-comments" />
            </div>
            <div className={styles.personal__value}>{patient.language}</div>
          </div>
          <div className={`${styles.personal__status} ${styles.personal__table}`}>
            <div className={styles.personal__icon}>
              <i className="fa fa-flag" />
            </div>
            <div className={styles.personal__value}>Active</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { patient, currentPatientState, tabTitle } = this.props;
    if (!patient) {
      return <div className={styles.loading}>Loading...</div>;
    }
    const isEditing = currentPatientState && currentPatientState[tabTitle].isEditing;
    return isEditing ? 
    this.renderEditingForm(patient)
    : this.renderPersonalInfo(patient);
  }
}

export default PersonalData;
