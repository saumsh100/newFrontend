
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar({ user, className, size }) {
  let classes = classNames(className, styles.avatar);
  if (size === 'lg') {
    classes = classNames(styles.large, classes);
  }

  const centerContent = user.avatarUrl ?
    <img className={styles.img} src={user.avatarUrl} alt={`Image of ${user.firstName}`} /> :
    <img className={styles.img} src={'/images/avatar.png'} alt={`Image of ${user.firstName}`} /> ;
  return (
    <div className={classes}>
      {centerContent}
    </div>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  user: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
};
