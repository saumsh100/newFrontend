
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import find from 'lodash/find';
import { RouterList } from '../library';

const PATHS = {
  '/settings/practice': [
    {
      to: '/settings/practice/general',
      label: 'General',
    },
    {
      to: '/settings/practice/users',
      label: 'Users',
    },
    {
      to: '/settings/practice/hours',
      label: 'Office Hours',
    },
    {
      to: '/settings/practice/onlinebooking',
      label: 'Online Booking',
    },
    {
      to: '/settings/practice/chairs',
      label: 'Chairs',
    },
    {
      to: '/settings/practice/superadmin',
      label: 'Super Admin',
      adminOnly: true,
    },
  ],

  '/settings/donna': [
    {
      to: '/settings/donna/reminders',
      label: 'Reminders',
      icon: 'clock',
    },
    {
      to: '/settings/donna/recalls',
      label: 'Recalls',
    },
    {
      to: '/settings/donna/reviews',
      label: 'Reviews',
    },
  ],

  '/settings/reasons': [
    {
      to: '/settings/reasons/reasonslist',
      label: 'Reasons List',
    },
  ],

  '/settings/practitioners': [
    {
      to: '/settings/practitioners/practitionerslist',
      label: 'Practitioners List',
    },
  ],
};

export default function SettingsSubNav({ location, className, users }) {
  const routes = find(PATHS, (route, key) => location.pathname.indexOf(key) === 0);
  // Workaround for redirects
  return routes ? (
    <RouterList location={location} routes={routes} className={className} users={users} />
  ) : null;
}

SettingsSubNav.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape(PropTypes.string),
  users: PropTypes.instanceOf(Map),
};
