
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues, submit, change } from 'redux-form';
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
import styles from './styles.scss';
import '../../../../../node_modules/emoji-mart/css/emoji-mart.css';

class MessageTextArea extends Component {
  constructor(props) {
    super(props);

    this.addEmoji = this.addEmoji.bind(this);
  }

  addEmoji(emoji) {
    const { chat, textBoxValue } = this.props;
    const messageArea = document.getElementsByName('message')[0];
    const caretPossition = messageArea.selectionStart;
    const newMessage = `${textBoxValue.slice(0, caretPossition)}${emoji.native}${textBoxValue.slice(caretPossition)}`;
    this.props.change(`chatMessageForm_${chat.id}`, 'message', newMessage);
    this.emojiDropdown.toggle();
  }

  renderSendButton() {
    const { canSend, chat, sendingMessage } = this.props;

    const sendButtonProps = {
      className: canSend && !sendingMessage ? styles.sendIcon : styles.sendIconDisabled,
      onClick:
        canSend && !sendingMessage ? () => this.props.submit(`chatMessageForm_${chat.id}`) : null,
    };

    return (
      <div {...sendButtonProps} data-test-id="button_sendMessage">
        <Icon icon="paper-plane" type="solid" />
        <label>SEND</label>
      </div>
    );
  }

  renderEmojiDropdown() {
    const emojiButtonLabel = props => (
      <Button {...props}>
        <Icon icon="smile" />
      </Button>
    );

    return (
      <div className={styles.smileIcon}>
        <DropdownMenu
          ref={(dropdown) => {
            this.emojiDropdown = dropdown;
          }}
          labelComponent={emojiButtonLabel}
          closeOnInsideClick={false}
          className={styles.emojiDropdown}
          align="left"
          upwards
        >
          <li className={styles.emojiContainer}>
            <Picker onClick={this.addEmoji} showPreview={false} emojiTooltip />
          </li>
        </DropdownMenu>
      </div>
    );
  }

  render() {
    const { chat, canSend, error } = this.props;

    if (!chat) return null;

    const tooltipPlacement = isHub() ? 'bottomRight' : 'top';

    return (
      <SContainer className={styles.textAreaContainer}>
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
          {this.renderEmojiDropdown()}
          {canSend ? (
            this.renderSendButton()
          ) : (
            <Tooltip placement={tooltipPlacement} overlay={error}>
              {this.renderSendButton()}
            </Tooltip>
          )}
        </SFooter>
      </SContainer>
    );
  }
}

MessageTextArea.propTypes = {
  chat: PropTypes.shape({ id: PropTypes.string }),
  textBoxValue: PropTypes.string,
  error: PropTypes.string,
  canSend: PropTypes.bool,
  sendingMessage: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
  submit: PropTypes.func,
  change: PropTypes.func,
};

function mapStateToProps(state, { chat = {} }) {
  const values = getFormValues(`chatMessageForm_${chat.id}`)(state);
  const patient = state.entities.getIn(['patients', 'models', chat.patientId]);
  const canSend = !!(!!values && !!values.message && patient && patient.mobilePhoneNumber);

  let error = 'Type a message';
  if (!patient) {
    error = 'Select a patient above';
  } else if (!patient.mobilePhoneNumber) {
    error = 'This patient does not have a mobile phone number';
  }

  return {
    textBoxValue: (values && values.message) || '',
    canSend,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      submit,
      change,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(MessageTextArea);
