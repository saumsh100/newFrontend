
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RouterTabs } from '../library';

const ROUTES = {
  '/schedule': [
    /* {
      to: '/schedule/calendar',
      label: 'Calendar View',
    },
    {
      to: '/schedule/appointments',
      label: 'Appointments List',
      disabled: true,
    }, */
  ],

  '/settings': [
    {
      to: '/settings/practice',
      label: 'Practice',
    },
    {
      to: '/settings/reasons',
      label: 'Reasons',
    },
    {
      to: '/settings/practitioners',
      label: 'Practitioners',
    },
    {
      to: '/settings/donna',
      label: 'Donna',
    },
  ],

  '/intelligence': [
    {
      to: '/intelligence/overview',
      label: 'Overview',
    },
    {
      to: '/intelligence/business',
      label: 'Business',
    },
    /* {
      to: '/intelligence/social',
      label: 'Social',
      disabled: true,
    }, */
  ],

  '/reputation': [
    {
      to: '/reputation/reviews',
      label: 'Reviews',
    },
    {
      to: '/reputation/listings',
      label: 'Listings',
    },
  ],

  /* '/social': [
    {
      to: '/social/patient',
      label: 'Patient Posts',
    },
    {
      to: '/social/practice',
      label: 'Practice Posts',
    }],
*/
  '/admin': [
    {
      to: '/admin/enterprises',
      label: 'Enterprises',
    },
    {
      to: '/admin/nasa',
      label: 'NASA',
    },
    {
      to: '/admin/play',
      label: 'Playground',
    },
  ],
};

class SubTabs extends Component {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    alert(`Changing to tab ${index}`);
  }

  render() {
    const { location: { pathname } } = this.props;
    const activeRoute = Object.keys(ROUTES).find(route => pathname.indexOf(route) === 0);

    return activeRoute ? <RouterTabs routes={ROUTES[activeRoute]} /> : null;
  }
}

SubTabs.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SubTabs;
