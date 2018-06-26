
import Avatar from '../Avatar';
import React, { PropTypes } from 'react';

export default function PractitionerAvatar({
  practitioner,
  className,
  size,
  onClick = () => {},
}) {
  let replaceSize = 100;
  if (size === 'extralg') {
    replaceSize = 400;
  } else if (size === 'lg') {
    replaceSize = 200;
  }
  let avatarUrl = null;

  if (practitioner.fullAvatarUrl) {
    avatarUrl = practitioner.fullAvatarUrl.replace('[size]', replaceSize);
  }

  return (
    <Avatar
      user={{
        avatarUrl,
        firstName: practitioner.firstName,
      }}
      className={className}
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
