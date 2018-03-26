
import React from 'react';
import ContactNotes from '../../demo/ContactNotes';
import styles from './styles.scss';

export default function Playground(props) {
  return (
    <div className={styles.page}>
      <ContactNotes />
    </div>
  );
}
