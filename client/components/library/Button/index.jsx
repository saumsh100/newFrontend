
import React from 'react';
import styles from './styles.scss';

export default function Button(props) {
  return <button className={styles.default} {...props} />;
}
