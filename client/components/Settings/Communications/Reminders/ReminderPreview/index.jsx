
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Lorem from 'react-lorem-component';
import moment from 'moment';
import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../../thunks/fetchEntities';
import {
  Button,
  Icon,
  Grid,
  Row,
  Col,
  Toggle,
  Input,
  DropdownSelect,
  Tabs,
  Tab,
  Header,
  SContainer,
  SHeader,
  SBody,
  SMSPreview,
} from '../../../../library';
import createReminderText from '../../../../../../server/lib/reminders/createReminderText';
import styles from './styles.scss';

const reminderMessage = 'Jane, this is a friendly reminder that you have an upcoming appointment with Dental Practice' +
  'on October 1st at 4 PM. Please take a moment to confirm your appointment by responding with \'C\'.';

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
    const isConfirmable = index === 1;

    // Fake Jane Doe Data
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    // Fake Appt Data
    const appointment = {
      // 1 day from now with no minutes
      startDate: moment().add(1, 'days').minutes(0).toISOString(),
    };

    let typePreview = null;
    if (primaryType === 'sms') {
      appointment.isPatientConfirmed = isConfirmable;
      const reminderMessage = createReminderText({ patient, account, appointment });
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          <SMSPreview
            from="+1 (780) 850-8886"
            message={reminderMessage}
          />
        </div>
      );
    } else if (primaryType === 'email') {
      typePreview = (
        <div className={styles.smsPreviewWrapper}>
          {`Email Preview ${isConfirmable ? '(Confirmed)' : ''}`}
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
