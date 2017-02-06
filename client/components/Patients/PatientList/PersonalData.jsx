import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import { Field as RField } from 'redux-form'
class PersonalData extends Component {
  constructor(props) {
    super(props);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { formChaned: false };
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

  handleClick(e) {
    if (e.target.tagName !== 'INPUT') {  
      const params = {
        id: this.props.patient.id,
        isEditing: false,
        title: this.props.tabTitle,
      };
      this.props.updateEditingPatientState(params); 
    }
  }

  handleClickSave(e) {
    e.preventDefault();
    const {
      patient,
      form,
      tabTitle,
      changePatientInfo,
    } = this.props;
    const formData = `${tabTitle}-${patient.id}`;
    const values = form[formData].values;
    values.id = patient.id;
    values.title = tabTitle;
    changePatientInfo(values);
  }

  componentWillReceiveProps(nextprops) {
    // It`s forced way to compare form values 
    // with previous ones in order to know if any field value was changed
    // because redux onChange doesn't trigger for some reason
    const { patient, form, tabTitle } = this.props;
    if (!patient) return;
    let formChanged = false;
    const formData = `${tabTitle}-${patient.id}`;
    if (!formData) return
    const initialValues = form[formData] && form[formData].initial;
    if (!initialValues) return;
    const nextValues = nextprops.form[formData] && nextprops.form[formData].values;
    const keys = Object.keys(initialValues);
    
    if (nextValues) {
      keys.forEach(k => {
        if (initialValues[k] !== nextValues[k]) {
          formChanged = true;
          return
        }
      });
    }

    if (formChanged !== this.state.formChanged) {
      this.setState({ formChanged });
    }
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
      birthday,
    }
    return (
      <div className={styles.right__personal} onClick={this.handleClick}>
        <div className={styles.edit_personal}>
          <Form form={dialogId}
            initialValues={initialValues}
          >
            <Field
              className={styles.edit_personal__name_first}
              type="text"
              name="firstName"
              placeholder="First name"
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
            <Field
              className={styles.edit_personal__name_last}
              type="date"
              name="birthday"
              placeholder="birthday"
            />
            <RField name="gender" 
              component="select"
              placeholder="gender"
            >
              <option value="male">Male</option>
              <option value="famale">Famale</option>
            </RField>

            <RField name="language" 
              component="select"
              placeholder="language"
            >
              <option value="English">English</option>
              <option value="German">German</option>
            </RField>
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
            <input 
              onClick={this.handleClickSave}
              className={styles.edit_personal__btn}
              type="submit"
              value="Save"
              disabled={!this.state.formChanged ? true : false }

            />
          </form>
        </div>
      </div>
    );
  }

  renderPersonalInfo(patient) {
    const { birthday, gender, name } = patient;
    const showBirthday = moment(birthday).calendar();
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
