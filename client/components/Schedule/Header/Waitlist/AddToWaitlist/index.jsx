
import React, { PropTypes } from 'react';
import {
  Form,
  FormSection,
  Field,
  Grid,
  Row,
  Col,
  Header,
  Avatar,
  Icon,
} from '../../../../library/index';
import DisplaySearchedPatient from '../../../AddNewAppointment/DisplaySearchedPatient';
import styles from './styles.scss';

export default function AddToWaitlist(props) {
  const {
    onSubmit,
    getSuggestions,
    formName,
    handleAutoSuggest,
    patientSearched,
  } = props;

  const initialValues = {
    preferences: {
      mornings: true,
      afternoons: true,
      evenings: true,
      weekdays: true,
      weekends: true,
    },

    unavailableDays: [],
  };

  const autoStyles = {
    group: styles.groupStyle,
    error: styles.errorStyle,
    icon: styles.iconStyle,
  };

  const displayField = !patientSearched ? (
    <Field
      component="AutoComplete"
      name="patientData"
      label="Enter Patient Name"
      getSuggestions={getSuggestions}
      placeholder="Add Patient"
      theme={autoStyles}
      onChange={(e, newValue) => handleAutoSuggest(newValue)}
      icon="search"
      data-test-id="patientData"
      required
    />
  ) : (
    <div
      className={styles.patientContainer}
      onClick={() => handleAutoSuggest('')}
    >
      <Avatar user={patientSearched} size="sm" />
      <div className={styles.patientContainer_name}>
        {patientSearched.firstName} {patientSearched.lastName}
      </div>
      <div className={styles.patientContainer_icon}>
        <Icon icon="search" />
      </div>
    </div>
  );

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      ignoreSaveButton
      data-test-id={formName}
    >
      <Grid className={styles.addToContainer}>
        <Row className={styles.searchContainer}>
          <Col xs={12} md={12}>
            {displayField}
          </Col>
        </Row>
        <FormSection name="daysOfTheWeek">
          <Row>
            <Col xs={12} className={styles.subHeaderMargin}>
              Preferred Day of the Week
            </Col>
          </Row>
          <Row className={styles.dayContainer}>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="sunday"
                label="Sun"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="monday"
                label="Mon"
                data-test-id="monday"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="tuesday"
                label="Tue"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="wednesday"
                label="Wed"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="thursday"
                label="Thur"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="friday"
                label="Fri"
              />
            </div>
            <div className={styles.colSpacing}>
              <Field
                component="CheckboxButton"
                name="saturday"
                label="Sat"
              />
            </div>
          </Row>
        </FormSection>
        <Row className={styles.subContainer}>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.subHeaderExtended}>
                  Preferred Timeframe
                </div>
              </Col>
            </Row>
            <FormSection name="preferences">
              <Row>
                <Col xs={12} md={12}>
                  <Field
                    name="mornings"
                    component="Checkbox"
                    label="Mornings"
                  />
                  <Field
                    name="afternoons"
                    component="Checkbox"
                    label="Afternoons"
                  />
                  <Field
                    name="evenings"
                    component="Checkbox"
                    label="Evenings"
                  />
                </Col>
              </Row>
            </FormSection>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AddToWaitlist.propTypes = {
  formName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  selectedWaitSpot: PropTypes.object,
  handleAutoSuggest: PropTypes.func.isRequired,
  patientSearched: PropTypes.object,
};

