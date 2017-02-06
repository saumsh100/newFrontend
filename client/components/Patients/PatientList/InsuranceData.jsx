import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';

class InsuranceData extends Component {
  constructor(props) {
    super(props);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  handleClickSave(e) {
    console.log('save data handled');
    e.preventDefault();

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
    return (
      <div onDoubleClick={this.handleClickEdit} className={styles.right__personal}>
        <div className={styles.insurance}>
          <div className={styles.insurance__header}>
            <div className={`${styles.insurance__company} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-medkit" />
              </div>
              <div className={styles.insurance__value}>SunLife</div>
            </div>
            <div className={`${styles.insurance__id} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>MEMBER ID</div>
              <div className={styles.insurance__value}>123-456-78</div>
            </div>
            <div className={`${styles.insurance__contact} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CONTRACT #</div>
              <div className={styles.insurance__value}>9101-11213</div>
            </div>
            <div className={`${styles.insurance__carrier} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CARRIER #</div>
              <div className={styles.insurance__value}>16</div>
            </div>
          </div>
          <div className={styles.insurance__footer}>
            <div className={`${styles.insurance__sin} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-id-card-o" />
              </div>
              <div className={styles.insurance__title}>SIN</div>
              <div className={styles.insurance__value}>123 456 789</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderEditform(patient) {
    const { tabTitle } = this.props;
    const dialogId = `${tabTitle}-${patient.id}`;
    const { insurance } = patient;
    let initialValues = insurance;
    if (!insurance) {
      initialValues = {};
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.edit_insurance}>

          <Form form={dialogId}
            initialValues={initialValues}
          >
            <Field
              className={styles.edit_insurance__input}
              type="text"
              name="insurance"
              placeholder="insurance"
            />
            <Field
              className={styles.edit_insurance__input}
              type="text"
              name="memberId"
              placeholder="memberId"
            />
            <Field
              className={styles.edit_insurance__input}
              type="text"
              name="contract"
              placeholder="contract"
            />
            <Field
              className={styles.edit_insurance__input}
              name="carrier"
              placeholder="carrier"
            />
            <Field
              className={styles.edit_insurance__input}
              name="sin"
              placeholder="sin"
            />
          </Form>

          <form>
            <div className={styles.edit_insurance__header}>
              <div className={`${styles.edit_insurance__company} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-medkit" />
                </div>
                <input className={styles.edit_insurance__input} type="text" placeholder="Insurance" />
              </div>
              <div className={`${styles.edit_insurance__id} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Member ID #" />

              </div>
              <div className={`${styles.edit_insurance__contact} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Contract #" />

              </div>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Carrier #" />
              </div>
            </div>
            <div className={styles.edit_insurance__footer}>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-id-card-o" />
                </div>
                <input className={styles.edit_insurance__input} type="text" placeholder="SIN #" />
              </div>
            </div>
            <input onClick={this.handleClickSave} className={styles.edit_insurance__btn} type="submit" value="Save" />
          </form>
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
