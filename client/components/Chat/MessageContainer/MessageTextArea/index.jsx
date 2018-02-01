
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues, submit } from 'redux-form';
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
    } = this.props;

    if (!chat) return null;

    const sendButtonProps = {
      className: canSend ? styles.sendIcon : styles.sendIconDisabled,
      onClick: canSend ? () => this.props.submit(`chatMessageForm_${chat.id}`) : null,
    };

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
          <div {...sendButtonProps}>
            <Icon
              icon="paper-plane"
              type="solid"
            />
            <label>
              SEND
            </label>
          </div>
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
  return {
    canSend,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submit,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageTextArea);
