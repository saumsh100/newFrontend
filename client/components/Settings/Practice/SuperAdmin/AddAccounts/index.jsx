import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import Icon from '../../../../library/Icon/index';
import { Grid, Row, Col } from '../../../../library/Grid/index';
import Account from '../../../../../entities/models/Account';
import styles from './styles.scss';

export default function AddAccounts({ onSubmit, activeAccount }) {
  const initialValues = {
    reputationManagement: !!activeAccount.get('vendastaSrId'),
    listings: !!activeAccount.get('vendastaMsId'),
    canSendReminders: !!activeAccount.get('twilioPhoneNumber'),
    callTracking: !!activeAccount.get('callrailId') || !!activeAccount.get('callrailIdV3'),
  };

  return (
    <Form
      enableReinitialize
      form="apis"
      onSubmit={onSubmit}
      initialValues={initialValues}
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
  activeAccount: PropTypes.instanceOf(Account),
};

AddAccounts.defaultProps = { activeAccount: null };
