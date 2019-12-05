
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import Icon from '../../../../library/Icon/index';
import { Grid, Row, Col } from '../../../../library/Grid/index';
import Account from '../../../../../entities/models/Account';
import styles from './styles.scss';

export default function AddAccounts({ onSubmit, index, formName, activeAccount }) {
  const { callrailId, twilioPhoneNumber, vendastaMsId, vendastaSrId } = activeAccount;

  const initialValues = {
    reputationManagement: !!vendastaSrId,
    listings: !!vendastaMsId,
    canSendReminders: !!twilioPhoneNumber,
    callTracking: !!callrailId,
  };

  return (
    <Form
      form={formName}
      onSubmit={values => onSubmit(values, index, formName)}
      initialValues={initialValues}
      destroyOnUnmount={false}
      alignSave="left"
    >
      <Grid className={styles.accountOptions}>
        <Row className={styles.accountOptions_row}>
          <Col xs={12} sm={12} md={12} lg={6} className={styles.accountOptions_column}>
            <div className={styles.displayFlex}>
              <span className={styles.icon}>
                <Icon icon="star" />
              </span>
              <span className={styles.accountOptions_text}>Reputation Management</span>
              <div>
                <Field component="Toggle" name="reputationManagement" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.icon}>
                <Icon icon="star" />
              </span>
              <span className={styles.accountOptions_text}>Directory Listings</span>
              <div>
                <Field component="Toggle" name="listings" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.icon}>
                <Icon icon="clock" />
              </span>
              <span className={styles.accountOptions_text}>Twilio</span>
              <div>
                <Field component="Toggle" name="canSendReminders" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.icon}>
                <Icon icon="phone" />
              </span>
              <span className={styles.accountOptions_text}>Call Tracking</span>
              <div>
                <Field component="Toggle" name="callTracking" />
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AddAccounts.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
  activeAccount: PropTypes.instanceOf(Account).isRequired,
};
