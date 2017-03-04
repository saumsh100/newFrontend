
import React, { PropTypes } from 'react';
import find from 'lodash/find';
import { RouterList } from '../library';

const PATHS = {
  '/settings/clinic': [
    {
      to: '/settings/clinic/general',
      label: 'General',
    },
    {
      to: '/settings/clinic/users',
      label: 'Users',
    },
    {
      to: '',
      label: 'Social Media',
    },
    {
      to: '',
      label: 'Reputation',
    },
    {
      to: '',
      label: 'Notifications',
    },
  ],

  '/settings/schedule': [
    {
      to: '/settings/schedule/hours',
      label: 'Office Hours',
    },
    {
      to: '',
      label: 'Online Booking',
    },
    {
      to: '',
      label: 'Reminders',
    },
    {
      to: '',
      label: 'Waitlist',
    },
  ],

  '/settings/services': [
    {
      to: '/settings/services/serviceslist',
      label: 'Services List',
    },
  ],
};

export default function SettingsSubNav({ location }) {
  const routes = find(PATHS, (route, key) => location.pathname.indexOf(key) === 0);
  return <RouterList location={location} routes={routes} />;
}

SettingsSubNav.propTypes = {
  location: PropTypes.object.isRequired,
};
