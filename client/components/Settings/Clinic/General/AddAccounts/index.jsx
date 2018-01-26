
import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../../../library';
import styles from './styles.scss';
import Icon from '../../../../library/Icon/index';
import { Grid, Row, Col } from '../../../../library/Grid/index';

export default function SelectAccountOptions(props) {
  const {
    onSubmit,
    index,
    formName,
    activeAccount,
  } = props;

  const {
    callrailId,
    twilioPhoneNumber,
    vendastaMsId,
    vendastaSrId,
  } = activeAccount;

  const initialValues = {
    reputationManagement: !!vendastaSrId,
    listings: !!vendastaMsId,
    canSendReminders: !!twilioPhoneNumber,
    callTracking: !!callrailId,
  };

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      destroyOnUnmount={false}
      alignSave="left"
    >
      <Grid className={styles.accountOptions}>
        <Row className={styles.accountOptions_row}>
          <Col xs={12} sm={12} md={12} lg={6} className={styles.accountOptions_column}>
            <div className={styles.displayFlex}>
              <span>
                <Icon icon="star" />
              </span>
              <span className={styles.accountOptions_text}>
                Reputation Management
              </span>
              <div>
                <Field
                  component="Toggle"
                  name="reputationManagement"
                />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span>
                <Icon icon="star" />
              </span>
              <span className={styles.accountOptions_text}>
                Directory Listings
              </span>
              <div>
                <Field
                  component="Toggle"
                  name="listings"
                />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span>
                <Icon icon="clock" />
              </span>
              <span className={styles.accountOptions_text}>
                Twilio
              </span>
              <div>
                <Field
                  component="Toggle"
                  name="canSendReminders"
                />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span>
                <Icon icon="phone" />
              </span>
              <span className={styles.accountOptions_text}>
                Call Tracking
              </span>
              <div>
                <Field
                  component="Toggle"
                  name="callTracking"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}
