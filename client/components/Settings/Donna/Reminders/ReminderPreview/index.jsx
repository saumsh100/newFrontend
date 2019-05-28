
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Header, SContainer, SHeader, SBody } from '../../../../library';
import EmailPreview from '../../../Shared/EmailPreview';
import SmsPreview from '../../../Shared/SmsPreview';
import PhonePreview from '../../../Shared/PhonePreview';
import CommsPreview, { CommsPreviewSection } from '../../../Shared/CommsPreview';
import styles from './styles.scss';

class ReminderPreview extends Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    // If new reminder is selected, go to Unconfirmed Tab
    if (nextProps.reminder.id !== this.props.reminder.id && this.state.index !== 0) {
      this.setState({ index: 0 });
    }
  }

  render() {
    const { reminder, account } = this.props;
    const { primaryTypes } = reminder;
    const { index } = this.state;
    const isConfirmable = index === 0;

    const getUrl = slug =>
      `/api/accounts/${account.id}/reminders/${reminder.id}` +
      `/${slug}?isConfirmable=${isConfirmable}`;

    // Slice so that it's immutable, reverse so that SMS is first cause its a smaller component
    const commsPreviewSections = primaryTypes
      .slice()
      .reverse()
      .map((type) => {
        let typePreview = null;
        if (type === 'sms') {
          typePreview = (
            <div>
              <SmsPreview account={account} url={getUrl('sms')} />
            </div>
          );
        } else if (type === 'email') {
          typePreview = (
            <div>
              <EmailPreview url={getUrl('preview')} />
            </div>
          );
        } else if (type === 'phone') {
          typePreview = (
            <div className={styles.smsPreviewWrapper}>
              <PhonePreview
                confirmed={!!this.state.index}
                openCallTestModal={this.props.openCallTestModal}
              />
            </div>
          );
        }

        return (
          <CommsPreviewSection key={`${reminder.id}_${type}_${isConfirmable}`}>
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
          <div className={styles.tabsContainer}>
            <Tabs index={index} onChange={i => this.setState({ index: i })} noUnderLine>
              <Tab label="Unconfirmed" className={styles.tab} activeClass={styles.activeTab} />
              <Tab label="Confirmed" className={styles.tab} activeClass={styles.activeTab} />
            </Tabs>
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          <CommsPreview>{commsPreviewSections}</CommsPreview>
        </SBody>
      </SContainer>
    );
  }
}

ReminderPreview.propTypes = {
  reminder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    primaryTypes: PropTypes.array.isRequired,
  }).isRequired,
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  openCallTestModal: PropTypes.func.isRequired,
};

export default ReminderPreview;
