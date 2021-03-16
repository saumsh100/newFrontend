
import PropTypes from 'prop-types';
import React from 'react';
import { isValidUUID } from '../../../../util/isomorphic';
import { Form, Field } from '../../../library';
import LastSyncDisplay from '../../../LastSyncDisplay';
import AccountModel from '../../../../entities/models/Account';
import TwilioPhoneNumber from './TwilioPhoneNumber';
import VendestaInfo from './VendastaInfo';
import CallRail from './CallRail';
import styles from './styles.scss';

const validateOmitIdsArray = (val) => {
  if (!val) return;
  const array = val.split(',');
  const predicate = v => !isValidUUID(v);
  if (array.some(predicate)) {
    return "Must UUIDs separated by ',' with no spaces";
  }
};

export default function SuperAdminForm({ onSubmit, activeAccount }) {
  const initialValues = {
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    callrailId: activeAccount.get('callrailId'),
    timeInterval: activeAccount.get('timeInterval'),
    suggestedChairId: activeAccount.get('suggestedChairId'),
    canSendReminders: activeAccount.get('canSendReminders'),
    canSendRecalls: activeAccount.get('canSendRecalls'),
    canSendReviews: activeAccount.get('canSendReviews'),
    googlePlaceId: activeAccount.get('googlePlaceId'),
    facebookUrl: activeAccount.get('facebookUrl'),
    sendRequestEmail: activeAccount.get('sendRequestEmail'),
    omitChairIdsString: activeAccount.get('omitChairIds').join(','),
    omitPractitionerIdsString: activeAccount.get('omitPractitionerIds').join(','),
  };

  const lastSyncDate = activeAccount.get('lastSyncDate');
  const lastSyncComponent = lastSyncDate && (
    <LastSyncDisplay date={lastSyncDate} className={styles.lastSyncWrapper} />
  );

  return (
    <Form
      enableReinitialize
      form="superAdminSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="superAdminSettingsForm"
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
      <TwilioPhoneNumber activeAccount={activeAccount} />
      <Field
        name="destinationPhoneNumber"
        label="Destination Phone Number"
        type="tel"
        data-test-id="destinationPhoneNumber"
      />
      <VendestaInfo activeAccount={activeAccount} />
      <CallRail activeAccount={activeAccount} />
      <Field name="suggestedChairId" label="Suggested Chair ID" data-test-id="suggestedChairId" />
      <Field name="facebookUrl" label="Facebook URL" data-test-id="facebookUrl" />
      <Field name="googlePlaceId" label="Google Place ID" data-test-id="googlePlaceId" />
      <Field
        name="omitPractitionerIdsString"
        label="Omit Practitioner IDs"
        validate={[validateOmitIdsArray]}
      />
      <Field name="omitChairIdsString" label="Omit Chair IDs" validate={[validateOmitIdsArray]} />
    </Form>
  );
}

SuperAdminForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  activeAccount: PropTypes.instanceOf(AccountModel),
};

SuperAdminForm.defaultProps = { activeAccount: null };
