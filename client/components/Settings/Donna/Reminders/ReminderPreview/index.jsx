
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Header, SContainer, SHeader, SBody } from '../../../../library';
import Account from '../../../../../entities/models/Account';
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

  componentDidUpdate(prevProps) {
    // If new reminder is selected, go to Unconfirmed Tab
    if (this.props.reminder.id !== prevProps.reminder.id && this.state.index !== 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ index: 0 });
    }
  }

  render() {
    const { reminder, account } = this.props;
    const { primaryTypes, isConfirmable, isWaitingRoomEnabled } = reminder;
    const indexZeroSelected = this.state.index === 0;
    const getUrl = slug =>
      `/api/accounts/${account.id}/reminders/${reminder.id}` +
      `/${slug}?isConfirmable=${!indexZeroSelected}&isWaitingRoomEnabled=${isWaitingRoomEnabled}`;
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
                confirmed={indexZeroSelected}
                twilioPhone={this.props.account.get('twilioPhoneNumber')}
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

    const normalTabs = isConfirmable ? (
      <Tabs index={this.state.index} onChange={i => this.setState({ index: i })} noUnderLine>
        <Tab label="Friendly" className={styles.tab} activeClass={styles.activeTab} />
        <Tab label="Confirmable" className={styles.tab} activeClass={styles.activeTab} />
      </Tabs>
    ) : (
      <Tabs index={this.state.index} noUnderLine>
        <Tab label="Friendly" className={styles.tab} activeClass={styles.activeTab} />
      </Tabs>
    );

    const waitingRoomTab = (
      <Tabs index={this.state.index} noUnderLine>
        <Tab label="Virtual Waiting Room" className={styles.tab} activeClass={styles.activeTab} />
      </Tabs>
    );

    const tabsSection = isWaitingRoomEnabled ? waitingRoomTab : normalTabs;

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
          <div className={styles.tabsContainer}>{tabsSection}</div>
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
    isConfirmable: PropTypes.bool.isRequired,
    isWaitingRoomEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  account: PropTypes.instanceOf(Account).isRequired,
  openCallTestModal: PropTypes.func.isRequired,
};

export default ReminderPreview;
