
import React from 'react';
import BackgroundIcon from '../BackgroundIcon';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Label(props) {
  const { iconColor, text, children } = props;
  return (
    <div
      className={styles.tags}
    >
      {children}
      <div className={styles.tags_text}>
        {text}
      </div>
      <Icon
        icon="close"
        className={styles.tags_close}
      />
    </div>
  );
}
