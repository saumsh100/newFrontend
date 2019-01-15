
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, SContainer, SHeader, SBody, SMSPreview } from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
import styles from './styles.scss';

const formatPhoneNumber = phone =>
  `+1 (${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8, 4)}`;

function ReviewSMSPreview({ patient, account }) {
  const link = 'carecru.co/a35fg';
  const recallMessage = `${patient.firstName}, we hope you had a lovely visit at ${
    account.name
  }. Let us know how it went by clicking the link below. ${link}`;
  const smsPhoneNumber =
    account.twilioPhoneNumber ||
    account.destinationPhoneNumber ||
    account.phoneNumber ||
    '+1112223333';

  return (
    <div className={styles.smsPreviewWrapper}>
      <SMSPreview from={formatPhoneNumber(smsPhoneNumber)} message={recallMessage} />
    </div>
  );
}

class ReviewPreview extends Component {
  render() {
    const { review, account } = this.props;

    const { primaryTypes } = review;

    // Fake Jane Doe Data
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes
      .slice()
      .reverse()
      .map((type) => {
        let typePreview = null;
        if (type === 'sms') {
          typePreview = (
            <div>
              <ReviewSMSPreview review={review} patient={patient} account={account} />
            </div>
          );
        } else if (type === 'email') {
          // TODO URL NOT FOUND (NOT DONE)
          const url = `/api/accounts/${account.id}/emails/preview?templateName=Patient Review`;
          typePreview = (
            <div>
              <EmailPreview url={url} />
            </div>
          );
        } else if (type === 'phone') {
          typePreview = <div className={styles.smsPreviewWrapper}>Phone Preview</div>;
        }

        return <CommsPreviewSection key={`${type}`}>{typePreview}</CommsPreviewSection>;
      });

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          <CommsPreview>{commsPreviewSections}</CommsPreview>
        </SBody>
      </SContainer>
    );
  }
}

ReviewPreview.propTypes = {
  review: PropTypes.shape({}).isRequired,
  account: PropTypes.shape({}).isRequired,
};

export default ReviewPreview;
