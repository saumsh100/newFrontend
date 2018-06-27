
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar({
  user,
  className,
  size,
  onClick = () => {},
  bgColor,
  isPatient,
  noPadding,
}) {
  let classes = classNames(className, styles.avatar);
  if (size) {
    classes = classNames(styles[size], classes);
  }

  const url = user.fullAvatarUrl || user.avatarUrl;
  const centerContent = url ? (
    <img className={styles.img} src={url} alt={`Image of ${user.firstName}`} />
  ) : (
    <span className={styles.text}>
      {user.firstName && user.firstName[0]}
      {user.lastName && user.lastName[0]}
    </span>
  );

  if (!isPatient) {
    classes = classNames(styles.user, classes);
  }

  let gradientStyle = classNames(styles.gradientBackground);

  if (noPadding) {
    gradientStyle = null;
  }

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

Avatar.defaultProps = {
  isPatient: true,
};

Avatar.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
  }),

  isPatient: PropTypes.bool.isRequired,
};
