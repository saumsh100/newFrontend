import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';

class InsuranceData extends Component {
  constructor(props) {
    super(props);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {};
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
    // if initial values are not defined, lets check if user filled
    // all fields and then make save btn enabled
    const registeredFieldsLength = nextprops.form[formData]
    && nextprops.form[formData].registeredFields.length;
    const filledFieldsLength = nextprops.form[formData]
    && Object.keys(nextprops.form[formData].values).length;

    const nextValues = nextprops.form[formData] && nextprops.form[formData].values;
    const keys = Object.keys(initialValues || []);
    if (nextValues) {
      keys.forEach(k => {
        if (initialValues[k] !== nextValues[k]) {
          formChanged = true;
          return;
        }
      });
    }
    if (!formChanged) {
      if (registeredFieldsLength === filledFieldsLength) formChanged = true;
    }
    if (formChanged !== this.state.formChanged) {
      this.setState({ formChanged });
    }
  }

  handleClick(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
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




  handleClickEdit() {
    const params = {
      id: this.props.patient.id,
      isEditing: true,
      title: this.props.tabTitle,
    };
    this.props.updateEditingPatientState(params);
  }

  renderEnsuranceDate(patient) {
    const insurance = patient.insurance || {}
    return (
      <div
        onDoubleClick={this.handleClickEdit}
        className={styles.right__personal}
      >
        <div className={styles.insurance}>
          <div className={styles.insurance__header}>
            <div className={`${styles.insurance__company} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-medkit" />
              </div>
              <div className={styles.insurance__value}>{insurance.insurance}</div>
            </div>
            <div className={`${styles.insurance__id} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>Member Id</div>
              <div className={styles.insurance__value}>{insurance.memberId}</div>
            </div>
            <div className={`${styles.insurance__contact} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CONTRACT #</div>
              <div className={styles.insurance__value}>{insurance.contract}</div>
            </div>
            <div className={`${styles.insurance__carrier} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CARRIER #</div>
              <div className={styles.insurance__value}>{insurance.carrier}</div>
            </div>
          </div>
          <div className={styles.insurance__footer}>
            <div className={`${styles.insurance__sin} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-id-card-o" />
              </div>
              <div className={styles.insurance__title}>SIN</div>
              <div className={styles.insurance__value}>{insurance.sin}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderEditform(patient) {
    const { tabTitle } = this.props;
    const dialogId = `${tabTitle}-${patient.id}`;
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


  render() {
    const { patient, currentPatientState, tabTitle } = this.props;
    if (!patient) {
      return <div className={styles.loading}>Loading...</div>;
    }

    const isEditing = currentPatientState && currentPatientState[tabTitle].isEditing;
    return isEditing ?
    this.renderEditform(patient)
    : this.renderEnsuranceDate(patient);
  }
}

export default InsuranceData;
