
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar({ user, className, size, onClick = () => {}, bgColor }) {
  let classes = styles.avatar;

  if (size) {
    classes = classNames(styles[size], classes);
  }

  const centerContent = user.fullAvatarUrl ?
    <img className={styles.img} src={user.fullAvatarUrl} alt={`Image of ${user.firstName}`} /> :
    <span className={styles.text}>{user.firstName && user.firstName[0]}</span>;

  let gradientStyle = classNames(className, styles.gradientBackground);

  if (bgColor) {
    gradientStyle = classNames(styles[bgColor], gradientStyle);
  }

  return (
    <div className={gradientStyle}>
      <div className={classes} onClick={onClick}>
        {centerContent}
      </div>
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
