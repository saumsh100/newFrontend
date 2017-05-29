
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar({ user, className, size, onClick = () => {} }) {
  let classes = classNames(className, styles.avatar);
  if (size === 'lg') {
    classes = classNames(styles.large, classes);
  }

  const centerContent = user.url ?
    <img className={styles.img} src={user.url} alt={`Image of ${user.firstName}`} /> :
    <span className={styles.text}>{user.firstName && user.firstName[0]}</span>;

  return (
    <div className={classes} onClick={onClick}>
      {centerContent}
    </div>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  user: PropTypes.shape({
    url: PropTypes.string,
    firstName: PropTypes.string.isRequired,
  }),
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
