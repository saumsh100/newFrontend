
import React from 'react';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function Picture(props) {
  const { reviewedPractitioner } = props;
  return (
    <div className={styles.blurBackground}>
      <Avatar
        size="xl"
        user={reviewedPractitioner}
      />
    </div>
  );
}

