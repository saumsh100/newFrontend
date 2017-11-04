
import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../library';
import { notNegative } from '../../../library/Form/validate';
import LastSyncDisplay from '../../../LastSyncDisplay';
import styles from './styles.scss';

const maxUnitSize = value => value && value > 60 ? 'Must be less than or equal to 180' : undefined;

export default function SuperAdminForm({ onSubmit, activeAccount }) {
  const initialValues = {
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    unit: activeAccount.get('unit'),
    timeInterval: activeAccount.get('timeInterval'),
    canSendReminders: activeAccount.get('canSendReminders'),
    canSendRecalls: activeAccount.get('canSendRecalls'),
    canSendReviews: activeAccount.get('canSendReviews'),
    googlePlaceId: activeAccount.get('googlePlaceId'),
    facebookUrl: activeAccount.get('facebookUrl'),
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
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
      {lastSyncComponent}
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText} >
            Can Send Reminders
          </div>
          <div className={styles.paddingField_toggle}>
            <Field
              component="Toggle"
              name="canSendReminders"
            />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>
            Can Send Reviews
          </div>
          <div className={styles.paddingField_toggle}>
            <Field
              component="Toggle"
              name="canSendReviews"
            />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText} >
            Can Send Recalls
          </div>
          <div className={styles.paddingField_toggle}>
            <Field
              component="Toggle"
              name="canSendRecalls"
            />
          </div>
        </div>
      </div>
      <div className={styles.paddingField}>
        <Field
          name="twilioPhoneNumber"
          label="Twilio Phone Number"
          type="tel"
          data-test-id="twilioPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="destinationPhoneNumber"
          label="Destination Phone Number"
          type="tel"
          data-test-id="destinationPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="vendastaId"
          label="Vendasta Id"
          data-test-id="vendastaId"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="unit"
          label="Schedule Unit"
          type="number"
          validate={[notNegative, maxUnitSize]}
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="timeInterval"
          label="Time Interval for Booking Widget"
          type="number"
          validate={[notNegative, maxUnitSize]}
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="facebookUrl"
          label="Facebook URL"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="googlePlaceId"
          label="Google Place ID"
        />
      </div>
    </Form>
  );

}
