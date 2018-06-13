
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import styles from '../styles.scss';
import Icon from '../../../../library/Icon/index';
import { Grid, Row, Col } from '../../../../library/Grid/index';

export default function SelectAccountOptions(props) {
  const { onSubmit, index, initialValues, formName } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <Grid className={styles.accountOptions}>
        <Row className={styles.accountOptions_row}>
          <Col xs={12} sm={12} md={12} lg={12} className={styles.accountOptions_column}>
            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="star" />
              </span>
              <span className={styles.accountOptions_text}>Reputation Management</span>
              <div>
                <Field component="Toggle" name="reputationManagement" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="book" />
              </span>
              <span className={styles.accountOptions_text}>Directory Listings</span>
              <div>
                <Field component="Toggle" name="listings" />
              </div>
            </div>

            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="phone" />
              </span>
              <span className={styles.accountOptions_text}>Call Tracking</span>
              <div>
                <Field component="Toggle" name="callTracking" />
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className={styles.accountOptions_column}>
            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="clock" />
              </span>
              <span className={styles.accountOptions_text}>Reminders</span>
              <div>
                <Field component="Toggle" name="canSendReminders" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="bullhorn" />
              </span>
              <span className={styles.accountOptions_text}>Recalls</span>
              <div>
                <Field component="Toggle" name="canSendRecalls" />
              </div>
            </div>
            <div className={styles.displayFlex}>
              <span className={styles.accountOptions_icon}>
                <Icon icon="comment" />
              </span>
              <span className={styles.accountOptions_text}>Reviews</span>
              <div>
                <Field component="Toggle" name="canSendReviews" />
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

SelectAccountOptions.propTypes = {
  onSubmit: PropTypes.func,
  index: PropTypes.number,
  initialValues: PropTypes.objectOf(PropTypes.string),
  formName: PropTypes.string,
};
