
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { Button, Avatar, Icon } from '../../library';
import PatientSearch from '../../PatientSearch';
import { isHub } from '../../../util/hub';
import UnknownPatient from '../unknownPatient';
import PatientPopover from '../../library/PatientPopover';
import styles from './styles.scss';

const toInputTheme = {
  container: styles.autocompleteContainer,
  suggestionsContainerOpen: styles.suggestionsContainer,
};

const toInputProps = { placeholder: 'To: Type name of patient' };

class ToHeader extends Component {
  renderPatientName() {
    const { isUnknown, firstName, lastName, cellPhoneNumber } = this.props.selectedPatient;
    return isUnknown ? (
      <span>{formatPhoneNumber(cellPhoneNumber)}</span>
    ) : (
      <PatientPopover patient={this.props.selectedPatient}>
        <span>
          <span>{firstName}</span>
          <span>{lastName}</span>
        </span>
      </PatientPopover>
    );
  }

  renderMobile() {
    const { selectedPatient, onPatientInfoClick, onPatientListClick } = this.props;

    return (
      <div className={classNames(styles.wrapper, { [styles.hubWrapper]: isHub() })}>
        {!isHub() && (
          <Button
            icon="arrow-left"
            className={styles.patientListButton}
            onClick={onPatientListClick}
          />
        )}
        {selectedPatient ? (
          <div className={styles.patientInfoWrapper}>
            <Button
              flat
              fluid
              onClick={() => {
                onPatientInfoClick(`${selectedPatient.firstName} ${selectedPatient.lastName}`);
              }}
              className={styles.patientInfoButton}
            >
              <Avatar size="xs" user={selectedPatient} />
              <div className={styles.patientInfoName}>{this.renderPatientName()}</div>
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
            <div className={styles.patientInfoName}>{this.renderPatientName()}</div>
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
  selectedPatient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isUnknown: PropTypes.bool,
    cellPhoneNumber: PropTypes.string,
  }),
  onPatientInfoClick: PropTypes.func.isRequired,
  onPatientListClick: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

ToHeader.defaultProps = { selectedPatient: null };

function mapStateToProps({ entities, chat }) {
  const selectedChatId = chat.get('selectedChatId');
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = selectedChat && selectedChat.patientId;

  if (selectedChat && selectedChat.patientPhoneNumber && !selectedChat.patientId) {
    return { selectedPatient: UnknownPatient(selectedChat.patientPhoneNumber) };
  }

  return { selectedPatient: patients.get(selectedPatientId) };
}

const enhance = connect(mapStateToProps);

export default enhance(ToHeader);
