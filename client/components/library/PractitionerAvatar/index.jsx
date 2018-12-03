
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';

export default function PractitionerAvatar({ practitioner, className, size, onClick }) {
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
        lastName: practitioner.lastName,
      }}
      className={className}
      size={size}
      onClick={onClick}
    />
  );
}

PractitionerAvatar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  practitioner: PropTypes.shape({
    lastName: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
};

PractitionerAvatar.defaultProps = {
  onClick: () => {},
  className: '',
  size: '',
};
