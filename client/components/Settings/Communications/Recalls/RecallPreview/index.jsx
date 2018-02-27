
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  SContainer,
  SHeader,
  SBody,
  SMSPreview,
} from '../../../../library';
import createRecallText from '../../../../../../server/lib/recalls/createRecallText';
import EmailPreview from '../../../Shared/EmailPreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
// import { convertPrimaryTypesToKey } from '../../../Shared/util/primaryTypes';
import styles from './styles.scss';

const formatPhoneNumber = phone => `+1 (${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8, 4)}`;

const wordMap = {
  sms: 'SMS',
  phone: 'Voice',
  email: 'Email',
};

function RecallSMSPreview({ patient, account, recall }) {
  const link = 'carecru.co/gg58h';
  const recallMessage = createRecallText({ patient, account, recall, link });
  const smsPhoneNumber = account.twilioPhoneNumber ||
    account.destinationPhoneNumber ||
    account.phoneNumber ||
    '+1112223333';

  return (
    <div className={styles.smsPreviewWrapper}>
      <SMSPreview
        from={formatPhoneNumber(smsPhoneNumber)}
        message={recallMessage}
      />
    </div>
  );
}

class RecallPreview extends Component {
  constructor(props) {
    super(props);
  }

  /*componentWillReceiveProps(nextProps) {

  }*/

  render() {
    const {
      recall,
      account,
    } = this.props;

    const { primaryTypes } = recall;

    // Fake Jane Doe Data
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes.slice().reverse().map((type) => {
      let typePreview = null;
      if (type === 'sms') {
        typePreview = (
          <div>
            <RecallSMSPreview
              recall={recall}
              patient={patient}
              account={account}
            />
          </div>
        );
      } else if (type === 'email') {
        const url = `/api/accounts/${account.id}/recalls/${recall.id}/preview`;
        typePreview = (
          <div>
            <EmailPreview url={url} />
          </div>
        );
      } else if (type === 'phone') {
        typePreview = (
          <div className={styles.smsPreviewWrapper}>
            {`Phone Preview`}
          </div>
        );
      }

      return (
        <CommsPreviewSection
          key={`${recall.id}_${type}`}
        >
          {typePreview}
        </CommsPreviewSection>
      );
    });

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          {/* TODO: No need for Tabs here, just need to be able to determine type and isConfirmable */}
          <CommsPreview>
            {commsPreviewSections}
          </CommsPreview>
        </SBody>
      </SContainer>
    );
  }
}

RecallPreview.propTypes = {
  recall: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

export default RecallPreview;
