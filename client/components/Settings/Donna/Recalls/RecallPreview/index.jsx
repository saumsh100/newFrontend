
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header, SContainer, SHeader, SBody } from "../../../../library";
import EmailPreview from "../../../Shared/EmailPreview";
import SmsPreview from "../../../Shared/SmsPreview";
import CommsPreview, {
  CommsPreviewSection
} from "../../../Shared/CommsPreview";
import styles from "./styles.scss";

function RecallSMSPreview({ account, recall }) {
  return (
    <div className={styles.smsPreviewWrapper}>
      <SmsPreview
        account={account}
        url={`/api/accounts/${account.id}/recalls/${recall.id}/sms`}
      />
    </div>
  );
}

class RecallPreview extends Component {
  constructor(props) {
    super(props);
  }

  /* componentWillReceiveProps(nextProps) {

  } */

  render() {
    const { recall, account } = this.props;

    const { primaryTypes } = recall;

    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes
      .slice()
      .reverse()
      .map((type) => {
        let typePreview = null;
        if (type === 'sms') {
          typePreview = (
            <div>
              <RecallSMSPreview recall={recall} account={account} />
            </div>
          );
        } else if (type === 'email') {
          const url = `/api/accounts/${account.id}/recalls/${
            recall.id
          }/preview`;
          typePreview = (
            <div>
              <EmailPreview url={url} />
            </div>
          );
        } else if (type === 'phone') {
          typePreview = (
            <div className={styles.smsPreviewWrapper}>Phone Preview</div>
          );
        }

        return (
          <CommsPreviewSection key={`${recall.id}_${type}`}>
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
          <CommsPreview>{commsPreviewSections}</CommsPreview>
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
