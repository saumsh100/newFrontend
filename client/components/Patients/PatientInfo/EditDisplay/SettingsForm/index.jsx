
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function SettingsForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="Form5"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <div className={styles.topPadding}>&nbsp;</div>
        <Row className={styles.row}>
          <Col xs={12} className={styles.colToggle}>
            <div className={styles.toggleContainer}>
              <div className={styles.toggleContainer_label}>Survey Subscription</div>
              <div className={styles.toggleContainer_toggle}>
              <Field
                component="Toggle"
                name="surveySubscription"
              />
              </div>
            </div>
          </Col>
          <Col xs={12} className={styles.colToggle}>
            <div className={styles.toggleContainer}>
              <div className={styles.toggleContainer_label}>Announcement Subscription</div>
              <div className={styles.toggleContainer_toggle}>
                <Field
                  component="Toggle"
                  name="announcementSubscription"
                />
              </div>
            </div>
          </Col>
          <Col xs={12} className={styles.colToggle}>
            <div className={styles.toggleContainer}>
              <div className={styles.toggleContainer_label}>Special/Holiday Messages Subscription</div>
              <div className={styles.toggleContainer_toggle}>
                <Field
                  component="Toggle"
                  name="birthdayMessages"
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
              <div className={styles.toggleContainer_label}>Reminders Subscription</div>
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
              <div className={styles.toggleContainer_label}>Recalls Subscription</div>
              <div className={styles.toggleContainer_toggle}>
                <Field
                  component="Toggle"
                  name="recalls"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </Form>
  )
}
