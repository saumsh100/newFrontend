import Avatar from '../Avatar';
import React, { PropTypes } from 'react';

export default function PractitionerAvatar({ practitioner, className, size, onClick = () => {} }) {
  return (
    <Avatar
      user={{
        avatarUrl: practitioner.fullAvatarUrl,
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
