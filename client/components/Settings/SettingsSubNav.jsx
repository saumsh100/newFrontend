
import React, { PropTypes } from 'react';
import find from 'lodash/find';
import { RouterList } from '../library';

const PATHS = {
  '/settings/clinic': [
    {
      to: '/settings/clinic/basic',
      label: 'Basic',
    },
    {
      to: '/settings/clinic/address',
      label: 'Address',
    },
  ],

  '/settings/booking': [
    {

    },
    {

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
