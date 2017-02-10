import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Form, Field } from '../../library';
import {destroy} from 'redux-form';
import _ from 'lodash';

class PersonalForm extends Component {
  constructor(props) {
    super(props);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.state = {formChanged: false};
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.patient.id !== this.props.patient.id) {
      const {patient} = this.props;
      const dialogId = `personal`;
      store.dispatch(destroy(dialogId));
    } else {
      const { patient, form, tabTitle } = this.props;
      if (!patient) return;
      let formChanged = false;
      const currentPatientFormFields = _.omit(nextprops.form.personal.values, 'title', 'id');
      const currentPatientFormFieldsLength = _.keys(currentPatientFormFields)
      .filter(k => (!!currentPatientFormFields[k])).length
      const currentPatientRegisteredFields = nextprops.form.personal.registeredFields;
      const currentPatientRegisteredFieldsLength = (currentPatientRegisteredFields &&
      currentPatientRegisteredFields.length) || 0;
      const { language, gender, birthday, status, name, middleName } = nextprops.patient;
      const firstName = name.split(" ")[0];
      const lastName = name.split(" ")[1];
      const currentPatientfields = {
        firstName,
        lastName,
        language,
        gender,
        birthday,
        status,
        middleName,
      }
      const currentPatientKeys = _.keys(currentPatientfields);
      if (currentPatientRegisteredFieldsLength === currentPatientFormFieldsLength)
      currentPatientKeys.forEach(p => {
        if (currentPatientfields[p] !== currentPatientFormFields[p]) {
          formChanged = true;
          return;
        }
        if (!!currentPatientRegisteredFields[p] && !currentPatientfields[p]) {
          formChanged = true;
          return;
        }

      });
      if (formChanged !== this.state.formChanged) {
        this.setState({formChanged});
      }
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
    const formData = tabTitle;
    const values = form[formData].values;
    values.id = patient.id;
    values.title = tabTitle;

    changePatientInfo(values);
  }

  render() {
    const {patient} = this.props;
    const dialogId = `personal`;

    const { name, birthday, language, gender, middleName, status } = patient;
    const fullName = patient.name.split(" ");
    const firstName = fullName[0];
    const lastName = fullName[1];
    const initialValues = {
      firstName,
      lastName,
      language,
      gender,
      birthday,
      status,
      middleName,
    };

    const saveBtnClass = `${styles.edit_personal__btn} ${this.state.formChanged ? styles.edit_personal__btn_enabled : ''}`
    return (
      <div className={styles.right__personal}>
        <div className={styles.edit_personal}>
          <Form form={dialogId}
                initialValues={initialValues}>
            <div className={`${styles.edit_personal__name} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-user"/>
              </div>
              <div className={styles.edit_personal__name_wrapper}>
                <Field
                  className={styles.edit_personal__name_first}
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  min
                />
                <Field
                  className={styles.edit_personal__name_m}
                  type="text"
                  name="middleName"
                  placeholder="M"
                  min
                />
                <Field
                  className={styles.edit_personal__name_last}
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  min
                />
              </div>
            </div>
            <div className={`${styles.edit_personal__info} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__info_header}>
                <div className={styles.edit_personal__icon}>
                  <i className="fa fa-calendar"/>
                </div>
                <Field
                  className={styles.edit_personal__birthday}
                  type="date"
                  name="birthday"
                  placeholder="birthday"
                  min
                />
              </div>
              <div className={styles.edit_personal__gender}>
                <Field name="gender" placeholder="gender" component="Select" min>
                  <option value="male">Male</option>
                  <option value="famale">Famale</option>
                </Field>
              </div>
            </div>
            <div className={`${styles.edit_personal__language} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-comments"/>
              </div>
              <Field name="language" placeholder="language" component="Select" min>
                <option value="English">English</option>
                <option value="German">German</option>
              </Field>
            </div>
            <div className={`${styles.edit_personal__status} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-flag" />
              </div>
              <Field name="status" placeholder="status" component="Select" min>
                <option value="Active">Active</option>
                <option value="Passive">Passive</option>
              </Field>
            </div>
            <input
              onClick={this.handleClickSave}
              className={saveBtnClass}
              type="submit"
              value="Save"
              disabled={ !this.state.formChanged ? true : false }/>
          </Form>
        </div>
      </div>
    );
  }
}

export default PersonalForm;
