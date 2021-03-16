import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../../library/ScheduleCalendar/modal.scss';
import ui from '../../../../styles/ui-kit.scss';

const ModalHeader = props => (
  <div className={styles.header}>
    <h1 className={ui.modal__title}>{props.title}</h1>
    <p className={ui.modal__helper}>{props.label}</p>
  </div>
);

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ModalHeader;
