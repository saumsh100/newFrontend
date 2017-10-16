
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar({ user, className, size, onClick = () => {} }) {
  let classes = classNames(className, styles.avatar);
  if (size === 'sm') {
    classes = classNames(styles.small, classes);
  }

  if (size === 'lg') {
    classes = classNames(styles.large, classes);
  }

  if (size === 'xl') {
    classes = classNames(styles.xlarge, classes);
  }

  if (size === 'extralg') {
    classes = classNames(styles.extraLarge, classes);
  }

  const centerContent = user.avatarUrl ?
    <img className={styles.img} src={user.avatarUrl} alt={`Image of ${user.firstName}`} /> :
    <span className={styles.text}>{user.firstName && user.firstName[0]}</span>;

  return (
    <div className={classes} onClick={onClick}>
      {centerContent}
    </div>
  );
}

Avatar.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
  }),
};
