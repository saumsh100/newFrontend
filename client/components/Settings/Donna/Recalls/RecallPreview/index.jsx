import React from 'react';
import PropTypes from 'prop-types';
import {Header, SBody, SContainer, SHeader} from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import SmsPreview from '../../../Shared/SmsPreview';
import CommsPreview, {CommsPreviewSection} from '../../../Shared/CommsPreview';
import styles from './styles.scss';

const RecallSMSPreview = ({ account, recall }) => (
    <div className={styles.smsPreviewWrapper}>
        <SmsPreview account={account} url={`/api/accounts/${account.id}/recalls/${recall.id}/sms`}/>
    </div>
);

const RecallPreview = ({recall, account}) => {

    const {primaryTypes} = recall;
    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes
        .slice()
        .reverse()
        .map((type) => {
            let typePreview = null;
            if (type === 'sms' || type === 'smart_follow_up') {
                typePreview = (
                    <div>
                        <RecallSMSPreview recall={recall} account={account}/>
                    </div>
                );
            } else if (type === 'email') {
                const url = `/api/accounts/${account.id}/recalls/${recall.id}/preview`;
                typePreview = (
                    <div>
                        <EmailPreview url={url}/>
                    </div>
                );
            } else if (type === 'phone') {
                typePreview = <div className={styles.smsPreviewWrapper}>Phone Preview</div>;
            }

            return (
                <CommsPreviewSection key={`${recall.id}_${type}`}>{typePreview}</CommsPreviewSection>
            );
        });

    return (
        <SContainer>
            <SHeader className={styles.previewHeader}>
                <div className={styles.topHeader}>
                    <Header title="Preview"/>
                </div>
            </SHeader>
            <SBody className={styles.previewSBody}>
                <CommsPreview>{commsPreviewSections}</CommsPreview>
            </SBody>
        </SContainer>
    );
};

RecallPreview.propTypes = {
  recall: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

export default RecallPreview;
