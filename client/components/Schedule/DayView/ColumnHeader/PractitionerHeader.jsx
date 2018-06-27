
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function PractitionerHeader(props) {
  const { scheduleView, practitioner } = props;

  return (
    <div className={styles.container}>
      <Avatar user={practitioner} size="sm" />
      <div className={styles.containerText}>
        <div className={styles.practitionerName}>{practitioner.prettyName}</div>
        <div className={styles.practitionerType}>{practitioner.type}</div>
      </div>
    </div>
  );
}

PractitionerHeader.propTypes = {
  scheduleView: PropTypes.string,
  practitioner: PropTypes.object,
};
