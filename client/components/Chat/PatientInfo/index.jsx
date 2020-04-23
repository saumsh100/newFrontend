
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Tab } from '../../library';
import About from './About';
import Appointments from './Appointments';
import { patientShape } from '../../library/PropTypeShapes/';
import UnknownPatient from '../unknownPatient';
import styles from './styles.scss';

class PatientInfo extends Component {
  constructor(props) {
    super(props);

    this.state = { tabIndex: 0 };
  }

  render() {
    const { patient, isFetchingProspect } = this.props;

    if (!patient || isFetchingProspect) return null;

    return (
      <Tabs
        fluid
        noUnderLine
        index={this.state.tabIndex}
        onChange={i => this.setState({ tabIndex: i })}
      >
        <Tab label="Personal" activeClass={styles.activeTab} inactiveClass={styles.inactiveTab}>
          <About patient={patient.toJS()} />
        </Tab>
        <Tab label="Appointments" activeClass={styles.activeTab} inactiveClass={styles.inactiveTab}>
          <Appointments patient={patient.toJS()} />
        </Tab>
      </Tabs>
    );
  }
}

PatientInfo.propTypes = {
  patient: PropTypes.shape(patientShape),
  isFetchingProspect: PropTypes.bool.isRequired,
};

PatientInfo.defaultProps = { patient: null };

function mapStateToProps({ entities, chat }) {
  const selectedChatId = chat.get('selectedChatId');
  const isFetchingProspect = chat.get('isFetchingProspect');
  const prospect = chat.get('prospect');
  const finalChat = selectedChatId || chat.get('newChat');
  const selectedChat = chat.get('selectedChat');
  const selectedPatientId =
    finalChat && finalChat.patientId
      ? finalChat.patientId
      : entities.getIn(['chats', 'models', finalChat, 'patientId']);
  const unknownPatientChat =
    !selectedPatientId && selectedChat && UnknownPatient(selectedChat.patientPhoneNumber, prospect);

  return {
    patient: entities.getIn(['patients', 'models', selectedPatientId]) || unknownPatientChat,
    isFetchingProspect,
  };
}

const enhance = connect(mapStateToProps);

export default enhance(PatientInfo);
