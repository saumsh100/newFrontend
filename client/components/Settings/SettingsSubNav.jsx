
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
      disabled: true,
    },
    {
      to: '',
      label: 'Reputation',
      disabled: true,
    },
    {
      to: '',
      label: 'Notifications',
      disabled: true,
    },
  ],

  '/settings/schedule': [
    {
      to: '/settings/schedule/hours',
      label: 'Office Hours',
    },
    {
      to: '/settings/schedule/onlinebooking',
      label: 'Online Booking',
    },
    {
      to: '/settings/schedule/chairs',
      label: 'Chairs',
    },
  ],

  '/settings/communications': [
    {
      to: '/settings/communications/reminders',
      label: 'Reminders',
      icon: 'clock-o',
    },
    {
      to: '/settings/communications/recalls',
      label: 'Recalls',
    },
    {
      to: '',
      label: 'Waitlist',
      disabled: true,
    },
  ],

  '/settings/services': [
    {
      to: '/settings/services/serviceslist',
      label: 'Services List',
    },
  ],

  '/settings/practitioners': [
    {
      to: '/settings/practitioners/practitionerslist',
      label: 'Practitioners List',
    },
  ],
};

export default function SettingsSubNav({ location, className, }) {
  const routes = find(PATHS, (route, key) => location.pathname.indexOf(key) === 0);

  // Workaround for redirects
  return routes ? <RouterList location={location} routes={routes} className={className} /> : null;
}

SettingsSubNav.propTypes = {
  location: PropTypes.object.isRequired,
};
