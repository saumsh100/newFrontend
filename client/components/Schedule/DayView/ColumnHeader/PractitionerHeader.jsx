
import React from 'react';
import PropTypes from 'prop-types';
import PractitionerAvatar from '../../../library/PractitionerAvatar';
import practitionerShape from '../../../library/PropTypeShapes/practitionerShape';
import styles from './styles.scss';

export default function PractitionerHeader(props) {
  const { practitioner } = props;

  return (
    <div className={styles.container}>
      <PractitionerAvatar practitioner={practitioner} size="sm" />
      <div className={styles.containerText}>
        <div className={styles.practitionerName}>{practitioner.prettyName}</div>
        <div className={styles.practitionerType}>{practitioner.type}</div>
      </div>
    </div>
  );
}

PractitionerHeader.propTypes = {
  practitioner: PropTypes.shape(practitionerShape).isRequired,
};
