
import React from 'react';
import PropTypes from 'prop-types';
import { Button, RemoteSubmitButton, DialogBox } from '../../../library';

export default function FormModal({
  active,
  title,
  onToggle,
  children,
  formName,
  isUpdate,
  containerStyles,
}) {
  return (
    <DialogBox
      active={active}
      containerStyles={containerStyles}
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
          label: isUpdate ? 'Update' : 'Add',
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

FormModal.propTypes = {
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  formName: PropTypes.string.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  containerStyles: PropTypes.string,
};

FormModal.defaultProps = {
  containerStyles: null,
};
