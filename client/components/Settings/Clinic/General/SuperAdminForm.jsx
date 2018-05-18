
import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';
import { notNegative } from '../../../library/Form/validate';
import LastSyncDisplay from '../../../LastSyncDisplay';
import styles from './styles.scss';

const maxUnitSize = value =>
  (value && value > 60 ? 'Must be less than or equal to 180' : undefined);

export default function SuperAdminForm({ onSubmit, activeAccount }) {
  const initialValues = {
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    unit: activeAccount.get('unit'),
    timeInterval: activeAccount.get('timeInterval'),
    suggestedChairId: activeAccount.get('suggestedChairId'),
    canSendReminders: activeAccount.get('canSendReminders'),
    canSendRecalls: activeAccount.get('canSendRecalls'),
    canSendReviews: activeAccount.get('canSendReviews'),
    googlePlaceId: activeAccount.get('googlePlaceId'),
    facebookUrl: activeAccount.get('facebookUrl'),
    sendRequestEmail: activeAccount.get('sendRequestEmail'),
  };

  const lastSyncDate = activeAccount.get('lastSyncDate');
  let lastSyncComponent = null;
  if (lastSyncDate) {
    lastSyncComponent = <LastSyncDisplay date={lastSyncDate} className={styles.lastSyncWrapper} />;
  }

  return (
    <Form
      form="superAdminSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="superAdminSettingsForm"
      alignSave="left"
    >
      {lastSyncComponent}
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>Can Send Reminders</div>
          <div className={styles.paddingField_toggle} data-test-id="toggle_canSendReminders">
            <Field component="Toggle" name="canSendReminders" />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>Can Send Reviews</div>
          <div className={styles.paddingField_toggle} data-test-id="toggle_canSendReviews">
            <Field component="Toggle" name="canSendReviews" />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>Can Send Recalls</div>
          <div className={styles.paddingField_toggle} data-test-id="toggle_canSendRecalls">
            <Field component="Toggle" name="canSendRecalls" />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>Send Request Emails</div>
          <div className={styles.paddingField_toggle} data-test-id="toggle_sendRequestEmail">
            <Field component="Toggle" name="sendRequestEmail" />
          </div>
        </div>
      </div>
      <Field
        name="twilioPhoneNumber"
        label="Twilio Phone Number"
        type="tel"
        data-test-id="twilioPhoneNumber"
      />
      <Field
        name="destinationPhoneNumber"
        label="Destination Phone Number"
        type="tel"
        data-test-id="destinationPhoneNumber"
      />
      <Field name="vendastaId" label="Vendasta Id" data-test-id="vendastaId" />
      <Field
        name="unit"
        label="Schedule Unit"
        type="number"
        validate={[notNegative, maxUnitSize]}
        data-test-id="unit"
      />
      <Field
        name="timeInterval"
        label="Time Interval for Booking Widget"
        type="number"
        validate={[notNegative, maxUnitSize]}
        data-test-id="timeInterval"
      />
      <Field name="suggestedChairId" label="Suggested Chair ID" data-test-id="suggestedChairId" />
      <Field name="facebookUrl" label="Facebook URL" data-test-id="facebookUrl" />
      <Field name="googlePlaceId" label="Google Place ID" data-test-id="googlePlaceId" />
    </Form>
  );
}

SuperAdminForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape({}),
};
