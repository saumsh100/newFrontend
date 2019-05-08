
import React from 'react';
import PropTypes from 'prop-types';
import { Header, SBody, SContainer, SHeader } from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
import SmsPreview from '../../../Shared/SmsPreview';
import styles from './styles.scss';

function ReviewPreview(props) {
  const { review, account } = props;
  const { primaryTypes } = review;

  // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
  const commsPreviewSections = primaryTypes
    .slice()
    .reverse()
    .map((type) => {
      let typePreview = null;
      if (type === 'sms') {
        const templateName = 'review-request';
        const link = 'carecru.co/a35fg';
        const firstName = 'Jane';
        const url = `/api/accounts/${account.id}/renderedTemplate` +
          `?templateName=${templateName}` +
          `&parameters[link]=${link}` +
          `&parameters[account][name]=${account.name}` +
          `&parameters[patient][firstName]=${firstName}`;
        typePreview = (
          <div>
            <SmsPreview account={account} url={url} />
          </div>
        );
      } else if (type === 'email') {
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

ReviewPreview.propTypes = {
  review: PropTypes.shape({}).isRequired,
  account: PropTypes.shape({}).isRequired,
};

export default ReviewPreview;
