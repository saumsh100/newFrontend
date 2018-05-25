
import React from 'react';
import Modal from '../Modal';
import DialogBody from '../DialogBody';

const DialogBox = props => (
  <Modal {...props}>
    <DialogBody {...props} />
  </Modal>
);

export default DialogBox;
