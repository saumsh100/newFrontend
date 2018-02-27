
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues, submit } from 'redux-form';
import {
  Form,
  Field,
  Icon,
  SContainer,
  SBody,
  SFooter,
  Tooltip,
} from '../../../library';
import styles from './styles.scss';

class MessageTextArea extends Component {
  renderSendButton() {
    const { canSend, chat, sendingMessage } = this.props;

    const sendButtonProps = {
      className: canSend && !sendingMessage ? styles.sendIcon : styles.sendIconDisabled,
      onClick: canSend && !sendingMessage ? () => this.props.submit(`chatMessageForm_${chat.id}`) : null,
    };

    return (
      <div {...sendButtonProps}>
        <Icon
          icon="paper-plane"
          type="solid"
        />
        <label>
          SEND
        </label>
      </div>
    );
  }

  render() {
    const {
      chat,
      canSend,
      error,
    } = this.props;

    if (!chat) return null;
    return (
      <SContainer className={styles.textAreaContainer}>
        <SBody className={styles.textAreaBody}>
          <Form
            key={`chatMessageForm_${chat.id}`}
            form={`chatMessageForm_${chat.id}`}
            ignoreSaveButton
            onSubmit={this.props.onSendMessage}
            data-test-id="chatMessageForm"
            destroyOnUnmount={false}
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
          {canSend ?
            this.renderSendButton() :
            <Tooltip
              placement="top"
              overlay={error}
            >
              {this.renderSendButton()}
            </Tooltip>
          }
        </SFooter>
      </SContainer>
    );
  }
}

MessageTextArea.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string,
  }),
  error: PropTypes.string,
  canSend: PropTypes.bool,
  sendingMessage: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
  submit: PropTypes.func,
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
    canSend,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submit,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageTextArea);
