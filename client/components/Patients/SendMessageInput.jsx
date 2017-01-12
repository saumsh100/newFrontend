
import React, { PropTypes, Component } from 'react';
import { Form, Field, Button } from '../library';

function SendMessageInput({ onSend }) {
    return (
      <Form form="chatMessageForm" onSubmit={onSend}>
        <Field
          type="text"
          name="message"
          label="Type a message"
        />
      </Form>
    );
}

SendMessageInput.propTypes = {
  patient: PropTypes.object,
  onSend: PropTypes.func.isRequired,
};

export default SendMessageInput;
