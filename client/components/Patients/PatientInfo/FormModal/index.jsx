
import React from 'react';
import PropTypes from 'prop-types';
import { Button, RemoteSubmitButton, DialogBox } from '../../../library';

export default function AddFormModal({ active, title, onToggle, children, formName }) {
  return (
    <DialogBox
      active={active}
      onEscKeyDown={onToggle}
      onOverlayClick={onToggle}
      title={title}
      actions={[
        {
          onClick: onToggle,
          label: 'Cancel',
          component: Button,
          props: { color: 'darkgrey' },
        },
        {
          label: 'Add',
          component: RemoteSubmitButton,
          props: {
            color: 'blue',
            form: formName,
            removePristineCheck: true,
          },
        },
      ]}
    >
      {children}
    </DialogBox>
  );
}

AddFormModal.propTypes = {
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  formName: PropTypes.string.isRequired,
};
