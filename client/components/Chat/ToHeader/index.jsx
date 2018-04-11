
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Icon } from '../../library';
import PatientSearch from '../../PatientSearch';
import styles from './styles.scss';

const toInputTheme = {
  container: styles.autocompleteContainer,
  suggestionsContainerOpen: styles.suggestionsContainer,
};

const toInputProps = {
  placeholder: 'To: Type name of patient',
};

class ToHeader extends Component {
  renderMobile() {
    const { selectedPatient, onPatientInfoClick, onPatientListClick } = this.props;

    return (
      <div className={styles.wrapper}>
        <Button
          icon="arrow-left"
          className={styles.patientListButton}
          onClick={onPatientListClick}
        />
        {selectedPatient ? (
          <div className={styles.patientInfoWrapper}>
            <Button flat fluid onClick={onPatientInfoClick} className={styles.patientInfoButton}>
              <Avatar size="sm" user={selectedPatient} />
              <div className={styles.patientInfoName}>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </div>
              <Icon className={styles.infoArrow} icon="angle-right" type="light" />
            </Button>
          </div>
        ) : (
          <PatientSearch
            placeholder="To: Type the name of the person"
            onSelect={this.props.onSearch}
            inputProps={toInputProps}
            theme={toInputTheme}
            focusInputOnMount
          />
        )}
      </div>
    );
  }

  renderDesktop() {
    const { selectedPatient } = this.props;
    return (
      <div className={styles.wrapper}>
        {selectedPatient ? (
          <div className={styles.patientInfoWrapper}>
            <Avatar size="sm" user={selectedPatient} />
            <div className={styles.patientInfoName}>
              <span>{selectedPatient.firstName}</span>
              <span>{selectedPatient.lastName}</span>
            </div>
          </div>
        ) : (
          <PatientSearch
            placeholder="To: Type the name of the person"
            onSelect={this.props.onSearch}
            inputProps={toInputProps}
            theme={toInputTheme}
          />
        )}
      </div>
    );
  }

  render() {
    return window.innerWidth > 576 ? this.renderDesktop() : this.renderMobile();
  }
}

ToHeader.propTypes = {
  newChat: PropTypes.instanceOf(Object),
  activeAccount: PropTypes.instanceOf(Object),
  selectedChat: PropTypes.instanceOf(Object),
  selectedPatient: PropTypes.instanceOf(Object),
  setNewChat: PropTypes.func.isRequired,
  mergeNewChat: PropTypes.func.isRequired,
  setSelectedChatId: PropTypes.func.isRequired,
  onPatientInfoClick: PropTypes.func,
  onPatientListClick: PropTypes.func,
  onSearch: PropTypes.func,
};

function mapStateToProps({ entities, chat }) {
  const selectedChatId = chat.get('selectedChatId');
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = selectedChat && selectedChat.patientId;

  return {
    // TODO: this is not right... shouldn't be getting activeAccount this way
    newChat: chat.get('newChat'),
    activeAccount: entities.getIn(['accounts', 'models']).first(),
    selectedPatient: patients.get(selectedPatientId),
  };
}

const enhance = connect(mapStateToProps);

export default enhance(ToHeader);
