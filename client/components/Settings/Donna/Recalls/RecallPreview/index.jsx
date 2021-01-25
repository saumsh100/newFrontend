
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, SBody, SContainer, SHeader, Tab, Tabs } from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import SmsPreview from '../../../Shared/SmsPreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
import Icon from '../../../../library/Icon';
import { accountShape } from '../../../../library/PropTypeShapes';
import Recall from '../../../../../entities/models/Recall';
import EnabledFeature from '../../../../library/EnabledFeature';
import styles from './styles.scss';

const RecallSMSPreview = ({ account, recall }) => (
  <SmsPreview
    account={account}
    url={`/api/accounts/${account.id}/recalls/${recall.id}/sms?t=${new Date().getTime()}`}
  />
);

RecallSMSPreview.propTypes = {
  recall: PropTypes.instanceOf(Recall).isRequired,
  account: PropTypes.instanceOf(accountShape).isRequired,
};

const customizeSmartFollowUpTemplate = (iframe) => {
  if (iframe) {
    const body = iframe.document.getElementsByTagName('body')[0];
    body.style.backgroundColor = '#eeeeee';
    const center = iframe.document.getElementsByTagName('center')[0];
    center.style.maxWidth = '590px';
    center.style.margin = '0 auto';
    center.style.padding = '28px 0';
    center.style.backgroundColor = '#fff';
    center.style.boxShadow = 'rgba(35, 47, 53, 0.09) 0 2px 8px 0';
    center.style.borderBottomLeftRadius = '10px';
    center.style.borderBottomRightRadius = '10px';
    center.style.transform = 'none';
    center.style.maxWidth = '440px';
  }
};

class RecallPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  render() {
    const { recall, account } = this.props;
    const { primaryTypes } = recall;
    const isSmartFollowUp = !!primaryTypes.find(v => v === 'smart_follow_up');
    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes
      .slice()
      .reverse()
      .map((type) => {
        let typePreview = null;
        const url = `/api/accounts/${account.id}/recalls/${
          recall.id
        }/preview?t=${new Date().getTime()}`;
        if (type === 'smart_follow_up') {
          typePreview =
            this.state.index === 0 ? (
              <div className={styles.commsPreviewSection}>
                <RecallSMSPreview recall={recall} account={account} />
              </div>
            ) : (
              <div>
                <div className={styles.headerSection}>
                  <div className={styles.leftSection}>
                    <div className={styles.emailIcon}>
                      <Icon icon="envelope" type="solid" />
                    </div>
                    <div className={styles.title}>MAIL</div>
                  </div>
                  <div className={styles.rightSection}>
                    <div className={styles.titleText}>now</div>
                  </div>
                </div>
                <EmailPreview url={url} customizeIframe={customizeSmartFollowUpTemplate} />
              </div>
            );
        } else if (type === 'sms') {
          typePreview = (
            <div>
              <RecallSMSPreview recall={recall} account={account} />
            </div>
          );
        } else if (type === 'email') {
          typePreview = (
            <div>
              <EmailPreview url={url} />
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
            <Header title="Preview" />
          </div>
          <div className={styles.tabsContainer}>
            <EnabledFeature
              predicate={({ flags }) => flags.get('smart-follow-up-email-preview')}
              render={() =>
                isSmartFollowUp && (
                  <Tabs
                    index={this.state.index}
                    onChange={i => this.setState({ index: i })}
                    noUnderLine
                  >
                    <Tab
                      label="Smart"
                      className={styles.tab}
                      activeClass={styles.activeTab}
                      tooltipBody={
                        <div className={styles.tooltipContainer}>
                          This Smart SMS follow up will only be sent if the patient has received a
                          previous recall text message and there has been no correspondence since.
                        </div>
                      }
                    />
                    <Tab
                      label="Fallback"
                      className={styles.tab}
                      activeClass={styles.activeTab}
                      tooltipBody={
                        <div className={styles.tooltipContainer}>
                          This email will only be sent out if the patient is unreachable via SMS. If
                          you would like to turn off the Email Fallback feature, please reach out to
                          your customer success manager.
                        </div>
                      }
                    />
                  </Tabs>
                )
              }
              fallback={() =>
                isSmartFollowUp && (
                  <Tabs
                    index={this.state.index}
                    onChange={i => this.setState({ index: i })}
                    noUnderLine
                    fluid
                  >
                    <Tab
                      fluid
                      label="Smart"
                      className={styles.tab}
                      activeClass={styles.activeTab}
                      tooltipBody={
                        <div className={styles.tooltipContainer}>
                          This Smart SMS follow up will only be sent if the patient has received a
                          previous recall text message and there has been no correspondence since.
                        </div>
                      }
                    />
                  </Tabs>
                )
              }
            />
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          <CommsPreview>{commsPreviewSections}</CommsPreview>
        </SBody>
      </SContainer>
    );
  }
}

RecallPreview.propTypes = {
  recall: PropTypes.instanceOf(Recall).isRequired,
  account: PropTypes.instanceOf(accountShape).isRequired,
};

export default RecallPreview;
