import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, SBody, SContainer, SHeader } from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
import SmsPreview from '../../../Shared/SmsPreview';
import styles from './styles.scss';
import Review from '../../../../../entities/models/Review';
import Account from '../../../../../entities/models/Account';

function ReviewPreview({ review, account, reviewsTemplateName }) {
  const { reviewsChannels } = review;

  // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
  const commsPreviewSections = reviewsChannels
    .slice()
    .reverse()
    .map((type) => {
      let typePreview = null;
      if (type === 'sms') {
        const templateName = 'review-request';
        const link = 'cru.care/[review-code]';
        const firstName = 'Jane';
        const url =
          `/api/accounts/${account.id}/renderedTemplate` +
          `?templateName=${templateName}` +
          `&parameters[link]=${link}` +
          `&parameters[account][name]=${account.name}` +
          `&parameters[patient][firstName]=${firstName}` +
          `&parameters[patient][displayName]=${firstName}`;
        typePreview = (
          <div>
            <SmsPreview account={account} url={url} />
          </div>
        );
      } else if (type === 'email') {
        const url = `/api/accounts/${account.id}/emails/preview?templateName=${reviewsTemplateName}`;
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
  review: PropTypes.instanceOf(Review).isRequired,
  reviewsTemplateName: PropTypes.string.isRequired,
  account: PropTypes.instanceOf(Account).isRequired,
};

const mapStateToProps = ({ featureFlags }) => ({
  reviewsTemplateName: featureFlags.getIn(['flags', 'review-request-email-template-name']),
});

export default connect(mapStateToProps)(ReviewPreview);
