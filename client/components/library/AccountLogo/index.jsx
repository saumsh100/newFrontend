
import Avatar from '../Avatar';
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function AccountLogo({ account, className, size, onClick = () => {} }) {
  let replaceSize = 100;
  if (size === 'extralg') {
    replaceSize = 400;
  } else if (size === 'lg') {
    replaceSize = 200;
  } else if (size === 'original') {
    replaceSize = 'original';
  }
  let avatarUrl = null;

  if (account.fullLogoUrl) {
    avatarUrl = account.fullLogoUrl.replace('[size]', replaceSize);
  }

  if (!avatarUrl) {
    return null;
  }

  return (
    <img
      src={avatarUrl}
      alt="Enter Logo Here"
      className={styles.logo}
      size={size}
      onClick={onClick}
    />
  );
}

Avatar.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    firstName: PropTypes.string.isRequired,
  }),
};
