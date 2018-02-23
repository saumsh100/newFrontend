
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

export default function SettingsForm(props) {
  const {
    handleSubmit,
    patient,
  } = props;

  const preferences = patient.preferences;

  return (
    <Form
      form="Form5"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      initialValues={{
        preferences,
      }}
      ignoreSaveButton
    >
      <FormSection name="preferences">
        <Grid className={styles.grid}>
          <div className={styles.topPadding}>&nbsp;</div>
          <Row className={styles.row}>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Special/Holiday Messages Subscription</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="birthdayMessage"
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Newsletter Subscription</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="newsletter"
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Appointment Reminders</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="reminders"
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Patient Recalls</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="recalls"
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Review Requests</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="reviews"
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} className={styles.colToggle}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleContainer_label}>Referral Requests</div>
                <div className={styles.toggleContainer_toggle}>
                  <Field
                    component="Toggle"
                    name="referrals"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </FormSection>
    </Form>
  )
}

SettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.object,
};
