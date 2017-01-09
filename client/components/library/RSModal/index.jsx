
import React from 'react';
import RSModal from 'reactstrap/lib/Modal';
import RSModalHeader from 'reactstrap/lib/ModalHeader';
import RSModalBody from 'reactstrap/lib/ModalBody';
import RSModalFooter from 'reactstrap/lib/ModalFooter';

export function Modal(props) {
  return <RSModal {...props} />;
}

export function ModalHeader(props) {
  return <RSModalHeader {...props} />;
}

export function ModalBody(props) {
  return <RSModalBody {...props} />;
}

export function ModalFooter(props) {
  return <RSModalFooter {...props} />;
}
