
import React from 'react';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function Picture(props) {
  const { reviewedPractitioner } = props;
  if (!reviewedPractitioner.fullAvatarUrl) {
    return <div className={styles.space} />;
  }


  return (
    <div className={styles.blurBackground}>
      <Avatar
        size="md"
        user={reviewedPractitioner}
      />
    </div>
  );
}

