import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues, submit, change } from 'redux-form';
import capitalize from 'lodash/capitalize';
import { Picker } from 'emoji-mart';
import {
  Button,
  DropdownMenu,
  Form,
  Field,
  Icon,
  SContainer,
  SBody,
  SFooter,
  Tooltip,
} from '../../../library';
import { isHub } from '../../../../util/hub';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import '../../../../../node_modules/emoji-mart/css/emoji-mart.css';
import Patient from '../../../../entities/models/Patient';
import styles from './styles.scss';

const EMOJI_SET = 'apple';
const EMOJI_SIZE = 32;

class MessageTextArea extends Component {
  constructor(props) {
    super(props);

    const sheetUrl = Picker.defaultProps.backgroundImageFn(EMOJI_SET, EMOJI_SIZE);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', sheetUrl); // pre-load the sprite
    xhr.send();

    this.emojiDropdown = createRef();
    this.addEmoji = this.addEmoji.bind(this);
    this.contactPoC = this.contactPoC.bind(this);
  }

  patientProfile = (patient) => {
    this.props.push(`/patients/${patient.id}`);
  };

  addEmoji(emoji) {
    const { chat, textBoxValue } = this.props;
    const messageArea = document.getElementsByName('message')[0];
    const caretPossition = messageArea.selectionStart;
    const newMessage = `${textBoxValue.slice(0, caretPossition)}${emoji.native}${textBoxValue.slice(
      caretPossition,
    )}`;
    this.props.change(`chatMessageForm_${chat.id}`, 'message', newMessage);
    this.emojiDropdown.current.props.clickToogle();
  }

  contactPoC() {
    const { poc } = this.props;
    this.props.selectChatOrCreate(poc);
  }

  renderSendButton() {
    const { canSend, chat, sendingMessage } = this.props;

    const sendButtonProps = {
      className: canSend && !sendingMessage ? styles.sendIcon : styles.sendIconDisabled,
      onClick:
        canSend && !sendingMessage ? () => this.props.submit(`chatMessageForm_${chat.id}`) : null,
    };

    return (
      <div {...sendButtonProps} data-test-id="button_sendMessage" data-testid="button_sendMessage">
        <Icon icon="paper-plane" type="solid" />
        <span className={styles.sendButton}>SEND</span>
      </div>
    );
  }

  renderHelper() {
    return (
      <div className={styles.tooltipWrapper}>
        {`The Point of Contact for a piece of contact information like a mobile phone number is
        defined as the person that owns the mobile phone number. Donna determines this by
        attributing to the newest family's head, or if no head present, the oldest person in that
        family.`}
      </div>
    );
  }

  render() {
    const { chat, canSend, error, isPoC, patient, poc, isPhoneNoAvailable, phoneLookupObj } =
      this.props;
    if (!chat || isPoC === null) return null;
    const hasPatient = patient && patient.id;
    const tooltipPlacement = isHub() ? 'bottomRight' : 'top';
    const patientFirstName = hasPatient && capitalize(patient.firstName);
    return (
      <SContainer className={styles.textAreaContainer}>
        {isPoC && hasPatient && phoneLookupObj?.isSMSEnabled === false && (
          <div className={styles.textAreaPoC}>
            <img
              src="/images/donna.png"
              height="335px"
              width="338px"
              alt="Donna"
              className={styles.donnaImg}
            />
            <div className={styles.notPoC}>
              <p>
                Looks like <strong>{patientFirstName}</strong>&apos;s cellphone number does not
                support SMS. Add a valid cellphone number or try another contact method.
              </p>
              <Button className={styles.pocButton} onClick={() => this.patientProfile(patient)}>
                Go to {patientFirstName}&apos;s Profile
              </Button>
            </div>
          </div>
        )}
        {!isPoC && hasPatient && (
          <div className={styles.textAreaPoC}>
            <img
              src="/images/donna.png"
              height="335px"
              width="338px"
              alt="Donna"
              className={styles.donnaImg}
            />
            <div className={styles.notPoC}>
              <p>
                Looks like <strong>{patient.firstName}</strong>, is not the{' '}
                <Tooltip
                  trigger={['hover']}
                  overlay={this.renderHelper}
                  placement="top"
                  overlayClassName="light"
                >
                  <span className={styles.pocHelper}>Point of Contact</span>
                </Tooltip>{' '}
                for their cell phone number. I think you are really trying to contact{' '}
                <strong>{`${poc.firstName} ${poc.lastName}`}</strong> instead.
              </p>
              <Button className={styles.pocButton} onClick={this.contactPoC}>
                Contact {poc.firstName}
              </Button>
            </div>
          </div>
        )}

        {!isPhoneNoAvailable && hasPatient && (
          <div className={styles.textAreaPoC}>
            <img
              src="/images/donna.png"
              height="335px"
              width="338px"
              alt="Donna"
              className={styles.donnaImg}
            />
            <div className={styles.notPoC}>
              <p>
                Looks like <strong>{patientFirstName}</strong> does not have a cellphone number. Add
                a valid cellphone number or try another contact method.
              </p>
              <Button className={styles.pocButton} onClick={() => this.patientProfile(patient)}>
                Go to {patientFirstName}&apos;s Profile
              </Button>
            </div>
          </div>
        )}
        <>
          <SBody className={styles.textAreaBody}>
            <Form
              destroyOnUnmount
              ignoreSaveButton
              key={`chatMessageForm_${chat.id}`}
              form={`chatMessageForm_${chat.id}`}
              onSubmit={this.props.onSendMessage}
              data-test-id="chatMessageForm"
              className={styles.textWrapper}
            >
              <div className={styles.textAreaWrapper}>
                <Field
                  onChange={this.button}
                  component="TextArea"
                  type="text"
                  name="message"
                  placeholder="Type a message"
                  data-test-id="message"
                />
              </div>
            </Form>
          </SBody>
          <SFooter className={styles.sendIconWrapper}>
            <div className={styles.smileIcon}>
              <DropdownMenu
                ref={this.emojiDropdown}
                labelComponent={(props) => (
                  <Button {...props}>
                    <Icon icon="smile" />
                  </Button>
                )}
                closeOnInsideClick={false}
                className={styles.emojiDropdown}
                align="left"
                upwards
              >
                <li className={styles.emojiContainer}>
                  <Picker
                    onClick={this.addEmoji}
                    showPreview={false}
                    emojiTooltip
                    set={EMOJI_SET}
                    size={EMOJI_SIZE}
                  />
                </li>
              </DropdownMenu>
            </div>
            {canSend ? (
              this.renderSendButton()
            ) : (
              <Tooltip placement={tooltipPlacement} overlay={error}>
                {this.renderSendButton()}
              </Tooltip>
            )}
          </SFooter>
        </>
      </SContainer>
    );
  }
}

MessageTextArea.propTypes = {
  chat: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.shape({ id: PropTypes.string })]),
  textBoxValue: PropTypes.string,
  error: PropTypes.string,
  canSend: PropTypes.bool.isRequired,
  sendingMessage: PropTypes.bool.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  isPoC: PropTypes.bool,
  patient: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.instanceOf(Patient)]),
  poc: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.instanceOf(Patient)]),
  selectChatOrCreate: PropTypes.func.isRequired,
  isPhoneNoAvailable: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
  phoneLookupObj: PropTypes.shape({
    isPhoneLookupChecked: PropTypes.bool,
    isSMSEnabled: PropTypes.bool,
    isVoiceEnabled: PropTypes.bool,
  }),
};

MessageTextArea.defaultProps = {
  chat: {},
  poc: {},
  textBoxValue: '',
  error: '',
  patient: {},
  isPoC: true,
  phoneLookupObj: {},
};

function mapStateToProps(state, { chat = {} }) {
  const values = getFormValues(`chatMessageForm_${chat.id}`)(state);
  const patient = state.entities.getIn(['patients', 'models', chat.patientId]);
  const phoneNumber = patient ? patient.get('cellPhoneNumber') : chat.patientPhoneNumber;
  const isPoC = state.chat.get('isPoC') || !!(!patient && chat.patientPhoneNumber);
  const canSend = !!phoneNumber && !!(values && values.message) && isPoC;
  const error =
    (!patient && 'Select a patient above') ||
    (phoneNumber ? 'Type a message' : 'This patient does not have a mobile phone number');
  const poc = state.chat.get('chatPoC') || {};

  return {
    isPoC,
    phoneNumber,
    accountId: state.auth.get('accountId'),
    textBoxValue: (values && values.message) || '',
    canSend,
    error,
    poc,
    patient,
    isPhoneNoAvailable: state.chat.get('isPhoneNoAvailable'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
      submit,
      change,
      fetchEntitiesRequest,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageTextArea);
