import React from 'react';
import PropTypes from 'prop-types';
import { SHeader, Icon } from '../../../library';
import ui from './styles.scss';

const ModalHeader = (props) => (
  <div className="ui.modal">
    <SHeader className={ui.modal_header}>
      {props.title}
      <div
        role="button"
        className={ui.modal_closeIcon}
        onClick={props.hideModal}
        tabIndex={0}
        onKeyDown={(e) => e.keyCode === 13 && props.hideModal}
      >
        <Icon icon="times" />
      </div>
    </SHeader>
    <p className={ui.modal_helper}>{props.label}</p>
  </div>
);

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default ModalHeader;
