import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import { Field as RField } from 'redux-form';
import { destroy } from 'redux-form';
class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.state = { formChanged: false };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.patient.id !== this.props.patient.id) {
      const { patient } = this.props;
      const dialogId = `insurance`;
      store.dispatch(destroy(dialogId));
    } else {
      const { patient, form, tabTitle } = this.props;
      if (!patient) return;
      let formChanged = false;
      const currentPatientFormFields = nextprops.form.insurance.values;
      const currentPatientFormFieldsLength = Object.keys(currentPatientFormFields).length
      if (nextprops.patient.insurance) {
	      const { sin, carrier, contract, memberId, insurance } = nextprops.patient.insurance;
	      const currentPatientfields = { sin, carrier, contract, memberId, insurance }; 
	      const currentPatientKeys = Object.keys(currentPatientfields);
	      currentPatientKeys.forEach(p => {
	        if (currentPatientfields[p] !== currentPatientFormFields[p]) {
	          formChanged = true;
	          return;
	        }
	      })
      } else if (currentPatientFormFieldsLength) {
      	const currentPatientFormKeys = Object.keys(currentPatientFormFields);
      	const keyLength = currentPatientFormKeys.length;
      	const registeredFields = nextprops.form.insurance.registeredFields;
      	const registeredFieldsLength = Object.keys(registeredFields).length;
      	if (registeredFieldsLength == currentPatientFormFieldsLength) {
      		formChanged = true;
      	}
      	currentPatientFormKeys.forEach(k => {
      	  if(!currentPatientFormFields[k]) formChanged = false
      	});
      }

      if (formChanged !== this.state.formChanged) {
        this.setState({ formChanged });
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
    const { tabTitle, patient } = this.props;
    const dialogId = tabTitle;
    const initialValues = patient.insurance || {};
    const saveBtnClass = `${styles.edit_personal__btn} ${this.state.formChanged ? styles.edit_personal__btn_enabled : ''}`

    return (
      <div className={styles.right__personal} onClick={this.handleClick}>
        <div className={styles.edit_insurance}>
          <Form form={dialogId}
            initialValues={initialValues}>
            <div className={styles.edit_insurance__header}>
              <div className={`${styles.edit_insurance__company} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-medkit" />
                </div>
                <Field
                  className={styles.edit_insurance__input}
                  type="text"
                  name="insurance"
                  placeholder="Insurance #"
                  min
                />
              </div>
              <div className={`${styles.edit_insurance__id} ${styles.edit_insurance__table}`}>
                <Field
                  className={styles.edit_insurance__input}
                  type="text"
                  name="memberId"
                  placeholder="Member ID #"
                  min
                />

              </div>
              <div className={`${styles.edit_insurance__contact} ${styles.edit_insurance__table}`}>
                <Field
                  className={styles.edit_insurance__input}
                  type="text"
                  name="contract"
                  placeholder="Contract #"
                  min
                />

              </div>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <Field
                  className={styles.edit_insurance__input}
                  name="carrier"
                  placeholder="Carrier #"
                  min
                />
              </div>
            </div>
            <div className={styles.edit_insurance__footer}>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-id-card-o" />
                </div>
                <Field
                  className={styles.edit_insurance__input}
                  name="sin"
                  placeholder="SIN #"
                  min
                />
              </div>
            </div>
            <input
              onClick={this.handleClickSave}
              className={saveBtnClass}
              type="submit"
              value="Save"
              disabled={!this.state.formChanged ? true : false }
            />
          </Form>
        </div>
      </div>
    )
  }

}

export default InsuranceForm;
