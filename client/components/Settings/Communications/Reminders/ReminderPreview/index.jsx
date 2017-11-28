
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Tabs,
  Tab,
  Header,
  SContainer,
  SHeader,
  SBody,
  SMSPreview,
} from '../../../../library';
import createReminderText from '../../../../../../server/lib/reminders/createReminderText';
import EmailPreview from '../../../Shared/EmailPreview';
import styles from './styles.scss';

const formatPhoneNumber = phone => `+1 (${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8, 4)}`;

class ReminderPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // If new reminder is selected, go to Unconfirmed Tab
    if ((nextProps.reminder.id !== this.props.reminder.id) && (this.state.index !== 0)) {
      this.setState({
        index: 0,
      });
    }
  }

  render() {
    const {
      reminder,
      account,
    } = this.props;
    const { primaryType } = reminder;
    const { index } = this.state;
    const isConfirmable = index === 0;

    // Fake Jane Doe Data
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    // Fake Appt Data
    const appointment = {
      // 1 day from now with no minutes
      startDate: moment().add(reminder.lengthSeconds, 'seconds').minutes(0).toISOString(),
    };

    let typePreview = null;
    if (primaryType === 'sms') {
      appointment.isPatientConfirmed = !isConfirmable;
      const reminderMessage = createReminderText({ patient, account, appointment });
      const smsPhoneNumber = account.twilioPhoneNumber ||
        account.destinationPhoneNumber ||
        account.phoneNumber ||
        '+1112223333';

      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          <SMSPreview
            from={formatPhoneNumber(smsPhoneNumber)}
            message={reminderMessage}
          />
        </div>
      );
    } else if (primaryType === 'email') {
      const url = `/api/accounts/${account.id}/reminders/${reminder.id}/preview?isConfirmable=${isConfirmable}`
      typePreview = (
        <div className={styles.smsPreviewWrapperFull}>
          <EmailPreview url={url} />
        </div>
      );
    } else if (primaryType === 'phone') {
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          {`Phone Preview ${isConfirmable ? '(Confirmed)' : ''}`}
        </div>
      );
    }

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
          <div className={styles.tabsContainer}>
            <Tabs
              index={index}
              onChange={i => this.setState({ index: i })}
              noUnderLine
            >
              <Tab
                label="Unconfirmed"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
              <Tab
                label="Confirmed"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
            </Tabs>
          </div>
        </SHeader>
        <SBody className={styles.previewSBody}>
          {/* TODO: No need for Tabs here, just need to be able to determine type and isConfirmable */}
          {typePreview}
        </SBody>
      </SContainer>
    );
  }
}

ReminderPreview.propTypes = {
  reminder: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

/*function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}*/

// const enhance = connect(null, mapDispatchToProps);

export default ReminderPreview;
