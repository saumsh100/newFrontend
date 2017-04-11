
import React, { Component } from 'react';
import { RouterTabs } from '../library';
import styles from './styles.scss';

const getRootPath = pathname => pathname;

const ROUTES = {
  '/patients': [
    {
      to: '/patients/list',
      label: 'Patients',
    },
    {
      to: '/patients/messages',
      label: 'Messages',
    },
    {
      to: '/patients/phone',
      label: 'Phone',
      disabled: true,
    },
  ],

  '/schedule': [
    {
      to: '/schedule/calendar',
      label: 'Calendar View',
    },
    {
      to: '/schedule/appointments',
      label: 'Appointments List',
      disabled: true,
    },
  ],

  '/settings': [
    {
      to: '/settings/clinic',
      label: 'Clinic',
    },
    {
      to: '/settings/schedule',
      label: 'Schedule',
    },
    {
      to: '/settings/services',
      label: 'Services',
    },
    {
      to: '/settings/practitioners',
      label: 'Practitioners',
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
    {
      to: '/intelligence/social',
      label: 'Social',
    },
  ],

  '/reputation': [
    {
      to: '/reputation/listings',
      label: 'Listings',
    },
    {
      to: '/reputation/reviews',
      label: 'Reviews',
    },
  ],

  '/social': [
    {
      to: '/social/patient',
      label: 'Patient Posts',
    },
    {
      to: '/social/practice',
      label: 'Practice Posts',
    }],
};

class SubTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    alert(`Changing to tab ${index}`);
    this.setState({ index });
  }


  render() {
    const { location } = this.props;

    // TODO: if we can strip off /${rootPath}/blah/blah then we can simplify below
    let subTabsComponent = null;
    if (location.pathname.indexOf('/patients') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/patients']}
        />
      );
    } else if (location.pathname.indexOf('/schedule') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/schedule']}
        />
      );
    } else if (location.pathname.indexOf('/settings') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/settings']}
        />
      );
    } else if (location.pathname.indexOf('/intelligence') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/intelligence']}
        />
      );
    } else if (location.pathname.indexOf('/reputation') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/reputation']}
        />
      );
    } else if (location.pathname.indexOf('/social') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/social']}
        />
      );
    }

    return subTabsComponent;
  }
}

export default SubTabs;
