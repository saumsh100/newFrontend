
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues, submit } from 'redux-form';
import debounce from 'lodash/debounce';
import {
  Avatar,
  Form,
  Field,
  Button,
  Icon,
  IconButton,
  SContainer,
  SBody,
  SFooter,
  Tooltip,
} from '../../../library';
import styles from './styles.scss';

class MessageTextArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      chat,
      canSend,
      error,
    } = this.props;

    if (!chat) return null;

    const sendButtonProps = {
      className: canSend ? styles.sendIcon : styles.sendIconDisabled,
      onClick: canSend ? debounce(() => this.props.submit(`chatMessageForm_${chat.id}`), 300) : null,
    };

    const sendButton = (
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
            sendButton :
            <Tooltip
              placement="top"
              overlay={error}
            >
              {sendButton}
            </Tooltip>
          }
        </SFooter>
      </SContainer>
    );
  }
}

MessageTextArea.propTypes = {
  chat: PropTypes.object,
  onSendMessage: PropTypes.func.isRequired,
  canSend: PropTypes.bool.isRequired,
};

function mapStateToProps(state, { chat = {} }) {
  const values = getFormValues(`chatMessageForm_${chat.id}`)(state);
  const patient = state.entities.getIn(['patients', 'models', chat.patientId]);
  const canSend = !!values && !!values.message && patient && patient.mobilePhoneNumber;

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
